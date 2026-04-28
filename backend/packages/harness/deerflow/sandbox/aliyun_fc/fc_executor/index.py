import base64
import fnmatch
import json
import os
import tempfile
import subprocess
import traceback
import urllib.request
import zipfile
from pathlib import Path
from typing import Any


VIRTUAL_USER_DATA_PREFIX = "/mnt/user-data"
VIRTUAL_ACP_WORKSPACE_PREFIX = "/mnt/acp-workspace"


def _http_download(url: str, dest_path: Path) -> None:
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest_path.write_bytes(resp.read())


def _http_put(url: str, data: bytes, content_type: str) -> None:
    req = urllib.request.Request(url, data=data, method="PUT")
    req.add_header("Content-Type", content_type)
    req.add_header("Content-Length", str(len(data)))
    with urllib.request.urlopen(req, timeout=120) as resp:
        resp.read()


def _safe_extract(zip_path: Path, dest_dir: Path) -> None:
    dest_dir = dest_dir.resolve()
    with zipfile.ZipFile(zip_path, "r") as zf:
        for member in zf.infolist():
            member_path = (dest_dir / member.filename).resolve()
            if not str(member_path).startswith(str(dest_dir)):
                raise RuntimeError("Unsafe zip content (path traversal).")
        zf.extractall(dest_dir)


def _zip_dir(src_dir: Path, zip_path: Path) -> None:
    src_dir = src_dir.resolve()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in src_dir.rglob("*"):
            if not p.is_file():
                continue
            zf.write(p, p.relative_to(src_dir).as_posix())


def _resolve_virtual_path(thread_root: Path, path: str) -> Path:
    p = path.strip()
    if p.startswith(VIRTUAL_USER_DATA_PREFIX):
        rel = p[len(VIRTUAL_USER_DATA_PREFIX) :].lstrip("/")
        base = thread_root / "user-data"
    elif p.startswith(VIRTUAL_ACP_WORKSPACE_PREFIX):
        rel = p[len(VIRTUAL_ACP_WORKSPACE_PREFIX) :].lstrip("/")
        base = thread_root / "acp-workspace"
    else:
        raise RuntimeError("Unsupported path prefix")

    resolved = (base / rel).resolve()
    if not str(resolved).startswith(str(base.resolve())):
        raise RuntimeError("Path traversal detected")
    return resolved


def _list_dir(root: Path, max_depth: int) -> list[str]:
    out: list[str] = []
    root = root.resolve()
    if not root.is_dir():
        return out

    base_depth = len(root.parts)
    for p in root.rglob("*"):
        depth = len(p.parts) - base_depth
        if depth <= 0 or depth > max_depth:
            continue
        rel = p.relative_to(root).as_posix()
        out.append(rel + ("/" if p.is_dir() else ""))
    return sorted(out)


def _glob(root: Path, pattern: str, include_dirs: bool, max_results: int) -> tuple[list[str], bool]:
    matches: list[str] = []
    truncated = False
    root = root.resolve()
    if not root.is_dir():
        return matches, truncated

    for current_root, dirs, files in os.walk(root):
        rel_dir = Path(current_root).relative_to(root)

        if include_dirs:
            for name in dirs:
                rel_path = (rel_dir / name).as_posix()
                if fnmatch.fnmatch(rel_path, pattern):
                    matches.append(rel_path + "/")
                    if len(matches) >= max_results:
                        return matches, True

        for name in files:
            rel_path = (rel_dir / name).as_posix()
            if fnmatch.fnmatch(rel_path, pattern):
                matches.append(rel_path)
                if len(matches) >= max_results:
                    return matches, True

    return matches, truncated


def _grep(root: Path, pattern: str, glob_pattern: str | None, literal: bool, case_sensitive: bool, max_results: int) -> tuple[list[dict[str, Any]], bool]:
    import re

    flags = 0 if case_sensitive else re.IGNORECASE
    rx = re.compile(re.escape(pattern) if literal else pattern, flags=flags)
    matches: list[dict[str, Any]] = []
    root = root.resolve()
    if not root.is_dir():
        return matches, False

    for current_root, _, files in os.walk(root):
        rel_dir = Path(current_root).relative_to(root)
        for name in files:
            rel_path = (rel_dir / name).as_posix()
            if glob_pattern is not None and not fnmatch.fnmatch(rel_path, glob_pattern):
                continue
            file_path = Path(current_root) / name
            try:
                with file_path.open(encoding="utf-8", errors="replace") as handle:
                    for line_number, line in enumerate(handle, start=1):
                        if rx.search(line):
                            matches.append({"path": rel_path, "line_number": line_number, "line": line.rstrip("\n\r")})
                            if len(matches) >= max_results:
                                return matches, True
            except OSError:
                continue

    return matches, False


def handler(event, context):
    try:
        if isinstance(event, (bytes, str)):
            event_data = json.loads(event.decode("utf-8") if isinstance(event, bytes) else event)
        elif isinstance(event, dict):
            event_data = event
        else:
            raise RuntimeError("Unsupported event type")

        action = event_data.get("action")
        snapshot_download_url = event_data.get("snapshot_download_url")
        snapshot_upload_url = event_data.get("snapshot_upload_url")

        if not action or not snapshot_upload_url:
            return {"success": False, "error": "Missing action or snapshot_upload_url"}

        with tempfile.TemporaryDirectory(prefix="deerflow-fc-") as td:
            td_path = Path(td)
            thread_root = td_path / "thread"
            thread_root.mkdir(parents=True, exist_ok=True)

            if snapshot_download_url:
                in_zip = td_path / "in.zip"
                _http_download(snapshot_download_url, in_zip)
                _safe_extract(in_zip, thread_root)

            (thread_root / "user-data" / "workspace").mkdir(parents=True, exist_ok=True)
            (thread_root / "user-data" / "uploads").mkdir(parents=True, exist_ok=True)
            (thread_root / "user-data" / "outputs").mkdir(parents=True, exist_ok=True)
            (thread_root / "acp-workspace").mkdir(parents=True, exist_ok=True)

            result: dict[str, Any] = {"success": True, "action": action}

            if action == "execute_command":
                command = event_data.get("command")
                if not command:
                    return {"success": False, "error": "Missing command"}
                cwd = str((thread_root / "user-data" / "workspace").resolve())
                p = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True, timeout=300)
                output = p.stdout or ""
                if p.stderr:
                    output = (output + ("\n" if output else "") + "Std Error:\n" + p.stderr).rstrip()
                if p.returncode != 0:
                    output = (output + ("\n" if output else "") + f"Exit Code: {p.returncode}").rstrip()
                result["output"] = output or "(no output)"

            elif action == "read_file":
                path = event_data.get("path")
                if not path:
                    return {"success": False, "error": "Missing path"}
                resolved = _resolve_virtual_path(thread_root, path)
                result["content"] = resolved.read_text(encoding="utf-8")

            elif action == "list_dir":
                path = event_data.get("path")
                max_depth = int(event_data.get("max_depth", 2))
                if not path:
                    return {"success": False, "error": "Missing path"}
                resolved = _resolve_virtual_path(thread_root, path)
                base = path.rstrip("/")
                result["files"] = [f"{base}/{rel.lstrip('/')}" for rel in _list_dir(resolved, max_depth=max_depth)]

            elif action == "write_file":
                path = event_data.get("path")
                content = event_data.get("content", "")
                append = bool(event_data.get("append", False))
                if not path:
                    return {"success": False, "error": "Missing path"}
                resolved = _resolve_virtual_path(thread_root, path)
                resolved.parent.mkdir(parents=True, exist_ok=True)
                mode = "a" if append else "w"
                resolved.open(mode, encoding="utf-8").write(content)

            elif action == "update_file":
                path = event_data.get("path")
                content_b64 = event_data.get("content_base64")
                if not path or not content_b64:
                    return {"success": False, "error": "Missing path or content_base64"}
                resolved = _resolve_virtual_path(thread_root, path)
                resolved.parent.mkdir(parents=True, exist_ok=True)
                resolved.write_bytes(base64.b64decode(content_b64))

            elif action == "glob":
                path = event_data.get("path")
                pattern = event_data.get("pattern")
                include_dirs = bool(event_data.get("include_dirs", False))
                max_results = int(event_data.get("max_results", 200))
                if not path or not pattern:
                    return {"success": False, "error": "Missing path or pattern"}
                resolved = _resolve_virtual_path(thread_root, path)
                matches, truncated = _glob(resolved, pattern, include_dirs=include_dirs, max_results=max_results)
                base = path.rstrip("/")
                result["matches"] = [f"{base}/{rel.lstrip('/')}" for rel in matches]
                result["truncated"] = truncated

            elif action == "grep":
                path = event_data.get("path")
                pattern = event_data.get("pattern")
                glob_pattern = event_data.get("glob")
                literal = bool(event_data.get("literal", False))
                case_sensitive = bool(event_data.get("case_sensitive", False))
                max_results = int(event_data.get("max_results", 100))
                if not path or not pattern:
                    return {"success": False, "error": "Missing path or pattern"}
                resolved = _resolve_virtual_path(thread_root, path)
                matches, truncated = _grep(
                    resolved,
                    pattern,
                    glob_pattern=glob_pattern,
                    literal=literal,
                    case_sensitive=case_sensitive,
                    max_results=max_results,
                )
                base = path.rstrip("/")
                for m in matches:
                    if isinstance(m, dict) and "path" in m:
                        m["path"] = f"{base}/{str(m['path']).lstrip('/')}"
                result["matches"] = matches
                result["truncated"] = truncated

            else:
                return {"success": False, "error": f"Unsupported action {action}"}

            out_zip = td_path / "out.zip"
            _zip_dir(thread_root, out_zip)
            _http_put(snapshot_upload_url, out_zip.read_bytes(), content_type="application/zip")

            return result

    except Exception as e:
        return {"success": False, "error": str(e), "traceback": traceback.format_exc()}
