from __future__ import annotations

import base64
import shutil
import tempfile
import uuid
import zipfile
from pathlib import Path
from typing import Any

from deerflow.config.paths import get_paths
from deerflow.sandbox.sandbox import Sandbox
from deerflow.sandbox.sandbox_provider import SandboxProvider
from deerflow.sandbox.search import GrepMatch

from .fc_client import FCClient
from .oss_manager import OSSManager


def _get_oss_manager_from_env() -> OSSManager:
    import os

    endpoint = os.getenv("ALIYUN_OSS_ENDPOINT")
    bucket_name = os.getenv("ALIYUN_OSS_BUCKET")
    access_key_id = os.getenv("ALIYUN_OSS_ACCESS_KEY_ID")
    access_key_secret = os.getenv("ALIYUN_OSS_ACCESS_KEY_SECRET")

    if not endpoint or not bucket_name or not access_key_id or not access_key_secret:
        raise RuntimeError("Missing OSS env (ALIYUN_OSS_ENDPOINT/BUCKET/ACCESS_KEY_ID/ACCESS_KEY_SECRET).")

    return OSSManager(
        access_key_id=access_key_id,
        access_key_secret=access_key_secret,
        endpoint=endpoint,
        bucket_name=bucket_name,
    )


def _zip_dir(src_dir: Path, zip_path: Path) -> None:
    src_dir = src_dir.resolve()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in src_dir.rglob("*"):
            if not p.is_file():
                continue
            arcname = p.relative_to(src_dir).as_posix()
            zf.write(p, arcname)


def _safe_extract(zip_path: Path, dest_dir: Path) -> None:
    dest_dir = dest_dir.resolve()
    with zipfile.ZipFile(zip_path, "r") as zf:
        for member in zf.infolist():
            member_path = (dest_dir / member.filename).resolve()
            if not str(member_path).startswith(str(dest_dir)):
                raise RuntimeError("Unsafe zip content (path traversal).")
        zf.extractall(dest_dir)


class AliyunFCSandbox(Sandbox):
    def __init__(self, sandbox_id: str, thread_id: str, fc_client: FCClient, oss: OSSManager):
        super().__init__(sandbox_id)
        self._thread_id = thread_id
        self._fc = fc_client
        self._oss = oss

    def _invoke(self, action: str, payload: dict[str, Any]) -> dict[str, Any]:
        paths = get_paths()
        paths.ensure_thread_dirs(self._thread_id)
        thread_dir = paths.thread_dir(self._thread_id)

        with tempfile.TemporaryDirectory(prefix="deerflow-fc-snap-") as td:
            td_path = Path(td)
            in_zip = td_path / "in.zip"
            out_zip = td_path / "out.zip"

            _zip_dir(thread_dir, in_zip)

            req_id = uuid.uuid4().hex
            in_key = f"sandbox_snapshots/{self._thread_id}/{req_id}/in.zip"
            out_key = f"sandbox_snapshots/{self._thread_id}/{req_id}/out.zip"

            self._oss.upload_file(in_key, str(in_zip))
            download_url = self._oss.generate_presigned_url(in_key, method="GET", expiration=3600)
            upload_url = self._oss.generate_presigned_url(out_key, method="PUT", expiration=3600)

            result = self._fc.invoke(
                {
                    "action": action,
                    "snapshot_download_url": download_url,
                    "snapshot_upload_url": upload_url,
                    **payload,
                }
            )

            ok = self._oss.download_file(out_key, str(out_zip))
            if ok:
                if thread_dir.exists():
                    shutil.rmtree(thread_dir)
                thread_dir.mkdir(parents=True, exist_ok=True)
                _safe_extract(out_zip, thread_dir)

            self._oss.delete_object(in_key)
            self._oss.delete_object(out_key)

            return result

    def execute_command(self, command: str) -> str:
        resp = self._invoke("execute_command", {"command": command})
        return resp.get("output", "") or resp.get("stdout", "") or ""

    def read_file(self, path: str) -> str:
        resp = self._invoke("read_file", {"path": path})
        if "content" in resp and isinstance(resp["content"], str):
            return resp["content"]
        return resp.get("output", "") or ""

    def list_dir(self, path: str, max_depth=2) -> list[str]:
        resp = self._invoke("list_dir", {"path": path, "max_depth": max_depth})
        files = resp.get("files", [])
        return files if isinstance(files, list) else []

    def write_file(self, path: str, content: str, append: bool = False) -> None:
        self._invoke("write_file", {"path": path, "content": content, "append": append})

    def glob(self, path: str, pattern: str, *, include_dirs: bool = False, max_results: int = 200) -> tuple[list[str], bool]:
        resp = self._invoke("glob", {"path": path, "pattern": pattern, "include_dirs": include_dirs, "max_results": max_results})
        matches = resp.get("matches", [])
        truncated = bool(resp.get("truncated", False))
        return (matches if isinstance(matches, list) else []), truncated

    def grep(
        self,
        path: str,
        pattern: str,
        *,
        glob: str | None = None,
        literal: bool = False,
        case_sensitive: bool = False,
        max_results: int = 100,
    ) -> tuple[list[GrepMatch], bool]:
        resp = self._invoke(
            "grep",
            {
                "path": path,
                "pattern": pattern,
                "glob": glob,
                "literal": literal,
                "case_sensitive": case_sensitive,
                "max_results": max_results,
            },
        )
        raw_matches = resp.get("matches", [])
        truncated = bool(resp.get("truncated", False))
        parsed: list[GrepMatch] = []
        if isinstance(raw_matches, list):
            for m in raw_matches:
                if not isinstance(m, dict):
                    continue
                if "path" not in m or "line_number" not in m or "line" not in m:
                    continue
                parsed.append(GrepMatch(path=str(m["path"]), line_number=int(m["line_number"]), line=str(m["line"])))
        return parsed, truncated

    def update_file(self, path: str, content: bytes) -> None:
        encoded = base64.b64encode(content).decode("utf-8")
        self._invoke("update_file", {"path": path, "content_base64": encoded})


class AliyunFCSandboxProvider(SandboxProvider):
    uses_thread_data_mounts = False

    def __init__(self):
        self._oss = _get_oss_manager_from_env()
        self._fc = FCClient()
        self._sandboxes: dict[str, AliyunFCSandbox] = {}

    def acquire(self, thread_id: str | None = None) -> str:
        if thread_id is None:
            raise RuntimeError("AliyunFCSandboxProvider requires thread_id")
        sandbox_id = f"fc-{thread_id}"
        if sandbox_id not in self._sandboxes:
            self._sandboxes[sandbox_id] = AliyunFCSandbox(sandbox_id=sandbox_id, thread_id=thread_id, fc_client=self._fc, oss=self._oss)
        return sandbox_id

    def get(self, sandbox_id: str) -> Sandbox | None:
        return self._sandboxes.get(sandbox_id)

    def release(self, sandbox_id: str) -> None:
        return None

