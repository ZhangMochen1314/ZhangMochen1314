"""Abstract base class for sandbox provisioning backends."""

from __future__ import annotations

import base64
import logging
import shlex
import time
import uuid
from abc import ABC, abstractmethod

import requests
from agent_sandbox import Sandbox as AioSandboxClient

from deerflow.sandbox.search import GrepMatch, path_matches, should_ignore_path, truncate_line

from .sandbox_info import SandboxInfo

logger = logging.getLogger(__name__)

_ERROR_OBSERVATION_SIGNATURE = "'ErrorObservation' object has no attribute 'exit_code'"


def wait_for_sandbox_ready(sandbox_url: str, timeout: int = 30) -> bool:
    """Poll sandbox health endpoint until ready or timeout.

    Args:
        sandbox_url: URL of the sandbox (e.g. http://k3s:30001).
        timeout: Maximum time to wait in seconds.

    Returns:
        True if sandbox is ready, False otherwise.
    """
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f"{sandbox_url}/v1/sandbox", timeout=5)
            if response.status_code == 200:
                return True
        except requests.exceptions.RequestException:
            pass
        time.sleep(1)
    return False


class SandboxBackend(ABC):
    """Abstract base for sandbox provisioning backends.

    Two implementations:
    - LocalContainerBackend: starts Docker/Apple Container locally, manages ports
    - RemoteSandboxBackend: connects to a pre-existing URL (K8s service, external)
    """

    @abstractmethod
    def create(self, thread_id: str, sandbox_id: str, extra_mounts: list[tuple[str, str, bool]] | None = None) -> SandboxInfo:
        """Create/provision a new sandbox.

        Args:
            thread_id: Thread ID for which the sandbox is being created. Useful for backends that want to organize sandboxes by thread.
            sandbox_id: Deterministic sandbox identifier.
            extra_mounts: Additional volume mounts as (host_path, container_path, read_only) tuples.
                Ignored by backends that don't manage containers (e.g., remote).

        Returns:
            SandboxInfo with connection details.
        """
        ...

    @abstractmethod
    def destroy(self, info: SandboxInfo) -> None:
        """Destroy/cleanup a sandbox and release its resources.

        Args:
            info: The sandbox metadata to destroy.
        """
        ...

    @abstractmethod
    def is_alive(self, info: SandboxInfo) -> bool:
        """Quick check whether a sandbox is still alive.

        This should be a lightweight check (e.g., container inspect)
        rather than a full health check.

        Args:
            info: The sandbox metadata to check.

        Returns:
            True if the sandbox appears to be alive.
        """
        ...

    @abstractmethod
    def discover(self, sandbox_id: str) -> SandboxInfo | None:
        """Try to discover an existing sandbox by its deterministic ID.

        Used for cross-process recovery: when another process started a sandbox,
        this process can discover it by the deterministic container name or URL.

        Args:
            sandbox_id: The deterministic sandbox ID to look for.

        Returns:
            SandboxInfo if found and healthy, None otherwise.
        """
        ...

    def list_running(self) -> list[SandboxInfo]:
        """Enumerate all running sandboxes managed by this backend.

        Used for startup reconciliation: when the process restarts, it needs
        to discover containers started by previous processes so they can be
        adopted into the warm pool or destroyed if idle too long.

        The default implementation returns an empty list, which is correct
        for backends that don't manage local containers (e.g., RemoteSandboxBackend
        delegates lifecycle to the provisioner which handles its own cleanup).

        Returns:
            A list of SandboxInfo for all currently running sandboxes.
        """
        return []

    def _get_client(self, info: SandboxInfo) -> AioSandboxClient:
        """Get or create an AioSandboxClient for the given sandbox info."""
        if not hasattr(self, "_clients"):
            self._clients = {}
        if info.sandbox_url not in self._clients:
            self._clients[info.sandbox_url] = AioSandboxClient(base_url=info.sandbox_url, timeout=600)
        return self._clients[info.sandbox_url]

    def execute_command(self, info: SandboxInfo, command: str) -> str:
        """Execute a shell command in the sandbox."""
        client = self._get_client(info)
        try:
            result = client.shell.exec_command(command=command)
            output = result.data.output if result.data else ""

            if output and _ERROR_OBSERVATION_SIGNATURE in output:
                logger.warning("ErrorObservation detected in sandbox output, retrying with a fresh session")
                fresh_id = str(uuid.uuid4())
                result = client.shell.exec_command(command=command, id=fresh_id)
                output = result.data.output if result.data else ""

            return output if output else "(no output)"
        except Exception as e:
            logger.error(f"Failed to execute command in sandbox: {e}")
            return f"Error: {e}"

    def read_file(self, info: SandboxInfo, path: str) -> str:
        """Read the content of a file in the sandbox."""
        client = self._get_client(info)
        try:
            result = client.file.read_file(file=path)
            return result.data.content if result.data else ""
        except Exception as e:
            logger.error(f"Failed to read file in sandbox: {e}")
            return f"Error: {e}"

    def list_dir(self, info: SandboxInfo, path: str, max_depth: int = 2) -> list[str]:
        """List the contents of a directory in the sandbox."""
        client = self._get_client(info)
        try:
            result = client.shell.exec_command(command=f"find {shlex.quote(path)} -maxdepth {max_depth} -type f -o -type d 2>/dev/null | head -500")
            output = result.data.output if result.data else ""
            if output:
                return [line.strip() for line in output.strip().split("\n") if line.strip()]
            return []
        except Exception as e:
            logger.error(f"Failed to list directory in sandbox: {e}")
            return []

    def write_file(self, info: SandboxInfo, path: str, content: str, append: bool = False) -> None:
        """Write content to a file in the sandbox."""
        client = self._get_client(info)
        try:
            if append:
                existing = self.read_file(info, path)
                if not existing.startswith("Error:"):
                    content = existing + content
            client.file.write_file(file=path, content=content)
        except Exception as e:
            logger.error(f"Failed to write file in sandbox: {e}")
            raise

    def update_file(self, info: SandboxInfo, path: str, content: bytes) -> None:
        """Update a file with binary content in the sandbox."""
        client = self._get_client(info)
        try:
            base64_content = base64.b64encode(content).decode("utf-8")
            client.file.write_file(file=path, content=base64_content, encoding="base64")
        except Exception as e:
            logger.error(f"Failed to update file in sandbox: {e}")
            raise

    def get_home_dir(self, info: SandboxInfo) -> str:
        """Get the home directory inside the sandbox."""
        client = self._get_client(info)
        context = client.sandbox.get_context()
        return context.home_dir

    def glob(self, info: SandboxInfo, path: str, pattern: str, *, include_dirs: bool = False, max_results: int = 200) -> tuple[list[str], bool]:
        """Find files matching a glob pattern."""
        client = self._get_client(info)
        if not include_dirs:
            result = client.file.find_files(path=path, glob=pattern)
            files = result.data.files if result.data and result.data.files else []
            filtered = [file_path for file_path in files if not should_ignore_path(file_path)]
            truncated = len(filtered) > max_results
            return filtered[:max_results], truncated

        result = client.file.list_path(path=path, recursive=True, show_hidden=False)
        entries = result.data.files if result.data and result.data.files else []
        matches: list[str] = []
        root_path = path.rstrip("/") or "/"
        root_prefix = root_path if root_path == "/" else f"{root_path}/"
        for entry in entries:
            if entry.path != root_path and not entry.path.startswith(root_prefix):
                continue
            if should_ignore_path(entry.path):
                continue
            rel_path = entry.path[len(root_path) :].lstrip("/")
            if path_matches(pattern, rel_path):
                matches.append(entry.path)
                if len(matches) >= max_results:
                    return matches, True
        return matches, False

    def grep(
        self,
        info: SandboxInfo,
        path: str,
        pattern: str,
        *,
        glob: str | None = None,
        literal: bool = False,
        case_sensitive: bool = False,
        max_results: int = 100,
    ) -> tuple[list[GrepMatch], bool]:
        """Search for a regex pattern in files."""
        import re as _re
        client = self._get_client(info)

        regex_source = _re.escape(pattern) if literal else pattern
        _re.compile(regex_source, 0 if case_sensitive else _re.IGNORECASE)
        regex = regex_source if case_sensitive else f"(?i){regex_source}"

        if glob is not None:
            find_result = client.file.find_files(path=path, glob=glob)
            candidate_paths = find_result.data.files if find_result.data and find_result.data.files else []
        else:
            list_result = client.file.list_path(path=path, recursive=True, show_hidden=False)
            entries = list_result.data.files if list_result.data and list_result.data.files else []
            candidate_paths = [entry.path for entry in entries if not entry.is_directory]

        matches: list[GrepMatch] = []
        truncated = False

        for file_path in candidate_paths:
            if should_ignore_path(file_path):
                continue

            search_result = client.file.search_in_file(file=file_path, regex=regex)
            data = search_result.data
            if data is None:
                continue

            line_numbers = data.line_numbers or []
            matched_lines = data.matches or []
            for line_number, line in zip(line_numbers, matched_lines):
                matches.append(
                    GrepMatch(
                        path=file_path,
                        line_number=line_number if isinstance(line_number, int) else 0,
                        line=truncate_line(line),
                    )
                )
                if len(matches) >= max_results:
                    truncated = True
                    return matches, truncated

        return matches, truncated
