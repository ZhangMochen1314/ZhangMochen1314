import base64
import logging
import shlex
import threading
import uuid

from agent_sandbox import Sandbox as AioSandboxClient

from deerflow.sandbox.sandbox import Sandbox
from deerflow.sandbox.search import GrepMatch, path_matches, should_ignore_path, truncate_line

from .backend import SandboxBackend
from .sandbox_info import SandboxInfo

logger = logging.getLogger(__name__)

_ERROR_OBSERVATION_SIGNATURE = "'ErrorObservation' object has no attribute 'exit_code'"


class AioSandbox(Sandbox):
    """Sandbox implementation using the agent-infra/sandbox Docker container.

    This sandbox connects to a running AIO sandbox container via HTTP API.
    A threading lock serializes shell commands to prevent concurrent requests
    from corrupting the container's single persistent session (see #1433).
    """

    def __init__(self, id: str, info: SandboxInfo, backend: SandboxBackend, home_dir: str | None = None):
        """Initialize the AIO sandbox.

        Args:
            id: Unique identifier for this sandbox instance.
            info: SandboxInfo containing connection details.
            backend: The backend that provisions and executes operations.
            home_dir: Home directory inside the sandbox. If None, will be fetched from the sandbox.
        """
        super().__init__(id)
        self._info = info
        self._backend = backend
        self._home_dir = home_dir
        self._lock = threading.Lock()

    @property
    def base_url(self) -> str:
        return self._info.sandbox_url

    @property
    def home_dir(self) -> str:
        """Get the home directory inside the sandbox."""
        if self._home_dir is None:
            self._home_dir = self._backend.get_home_dir(self._info)
        return self._home_dir

    def execute_command(self, command: str) -> str:
        """Execute a shell command in the sandbox."""
        with self._lock:
            return self._backend.execute_command(self._info, command)

    def read_file(self, path: str) -> str:
        """Read the content of a file in the sandbox."""
        return self._backend.read_file(self._info, path)

    def list_dir(self, path: str, max_depth: int = 2) -> list[str]:
        """List the contents of a directory in the sandbox."""
        with self._lock:
            return self._backend.list_dir(self._info, path, max_depth)

    def write_file(self, path: str, content: str, append: bool = False) -> None:
        """Write content to a file in the sandbox."""
        with self._lock:
            self._backend.write_file(self._info, path, content, append)

    def glob(self, path: str, pattern: str, *, include_dirs: bool = False, max_results: int = 200) -> tuple[list[str], bool]:
        return self._backend.glob(self._info, path, pattern, include_dirs=include_dirs, max_results=max_results)

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
        return self._backend.grep(
            self._info, path, pattern, glob=glob, literal=literal, case_sensitive=case_sensitive, max_results=max_results
        )

    def update_file(self, path: str, content: bytes) -> None:
        """Update a file with binary content in the sandbox."""
        with self._lock:
            self._backend.update_file(self._info, path, content)
