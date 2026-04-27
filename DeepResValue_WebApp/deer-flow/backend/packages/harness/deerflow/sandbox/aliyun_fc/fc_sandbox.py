import base64
import requests
from typing import Optional

from deerflow.sandbox.sandbox import Sandbox
from deerflow.sandbox.search import GrepMatch


class AliyunFCSandbox(Sandbox):
    """Aliyun Function Compute based Sandbox implementation."""

    def __init__(self, id: str, fc_endpoint: str = "http://mock-fc-endpoint.local"):
        super().__init__(id)
        self.fc_endpoint = fc_endpoint

    def _call_fc(self, action: str, payload: dict) -> dict:
        """Mock interaction with FC API or OSS via requests."""
        try:
            # In a real implementation, you would authenticate and call the Aliyun FC endpoint.
            # response = requests.post(
            #     f"{self.fc_endpoint}/invoke",
            #     json={"action": action, "payload": payload},
            #     timeout=30
            # )
            # response.raise_for_status()
            # return response.json()
            
            # Mock responses for now
            if action == "execute_command":
                return {"output": "Mock output for command"}
            elif action == "read_file":
                return {"content": "Mock file content"}
            elif action == "list_dir":
                return {"files": ["mock_file.txt", "mock_dir/"]}
            elif action == "write_file":
                return {"success": True}
            elif action == "glob":
                return {"matches": ["mock_match.txt"], "truncated": False}
            elif action == "grep":
                return {"matches": [], "truncated": False}
            elif action == "update_file":
                return {"success": True}
            
            return {}
        except Exception as e:
            # Log the error in a real app
            raise RuntimeError(f"FC invocation failed for action {action}: {e}")

    def execute_command(self, command: str) -> str:
        response = self._call_fc("execute_command", {"command": command})
        return response.get("output", "")

    def read_file(self, path: str) -> str:
        response = self._call_fc("read_file", {"path": path})
        return response.get("content", "")

    def list_dir(self, path: str, max_depth=2) -> list[str]:
        response = self._call_fc("list_dir", {"path": path, "max_depth": max_depth})
        return response.get("files", [])

    def write_file(self, path: str, content: str, append: bool = False) -> None:
        self._call_fc("write_file", {"path": path, "content": content, "append": append})

    def glob(
        self, 
        path: str, 
        pattern: str, 
        *, 
        include_dirs: bool = False, 
        max_results: int = 200
    ) -> tuple[list[str], bool]:
        response = self._call_fc("glob", {
            "path": path,
            "pattern": pattern,
            "include_dirs": include_dirs,
            "max_results": max_results
        })
        return response.get("matches", []), response.get("truncated", False)

    def grep(
        self,
        path: str,
        pattern: str,
        *,
        glob: Optional[str] = None,
        literal: bool = False,
        case_sensitive: bool = False,
        max_results: int = 100,
    ) -> tuple[list[GrepMatch], bool]:
        response = self._call_fc("grep", {
            "path": path,
            "pattern": pattern,
            "glob": glob,
            "literal": literal,
            "case_sensitive": case_sensitive,
            "max_results": max_results
        })
        # GrepMatch needs to be parsed if real data comes back.
        # For mock we return empty list.
        return response.get("matches", []), response.get("truncated", False)

    def update_file(self, path: str, content: bytes) -> None:
        # Encode binary content to base64 before sending via JSON
        encoded_content = base64.b64encode(content).decode("utf-8")
        self._call_fc("update_file", {"path": path, "content_base64": encoded_content})
