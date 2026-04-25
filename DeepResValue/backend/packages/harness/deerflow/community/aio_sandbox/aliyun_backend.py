import logging
import httpx
import asyncio
from typing import Optional

from .backend import SandboxBackend
from deerflow.sandbox.sandbox import Sandbox

logger = logging.getLogger(__name__)

class AliyunFCSandboxBackend(SandboxBackend):
    """
    A SandboxBackend that runs code using Aliyun Function Compute (FC).
    It manages HTTP requests to an Aliyun FC endpoint where the executor runs.
    """
    def __init__(self, endpoint: str, auth_token: str):
        self.endpoint = endpoint.rstrip("/")
        self.auth_token = auth_token
        self._client = httpx.AsyncClient(timeout=30.0)
        
    def _get_headers(self) -> dict:
        headers = {}
        if self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        return headers

    async def create(self, sandbox_id: str, thread_id: Optional[str] = None) -> None:
        """
        FC instances are stateless, but we can ensure the workspace directory exists
        on the NAS mount for this tenant/thread.
        """
        tenant_id = self._extract_tenant_id(thread_id)
        workdir = f"/mnt/auto/tenant_{tenant_id}/workspace"
        command = f"mkdir -p {workdir}"
        await self._request_fc("/exec_command", {"command": command})
        logger.info(f"Initialized Aliyun FC workspace for sandbox {sandbox_id} at {workdir}")

    async def destroy(self, sandbox_id: str) -> None:
        """
        Cleanup NAS resources if necessary. In many cases, we may want to keep the files,
        but if a true destroy is needed, we could rm -rf the directory.
        For now, this is a no-op as FC containers are ephemeral.
        """
        logger.info(f"Destroying Aliyun FC Sandbox {sandbox_id} (No-op for Serverless)")
        pass

    async def is_alive(self, sandbox_id: str) -> bool:
        """
        Always returns True if the endpoint is reachable.
        """
        try:
            # We can use a simple ping command to check if the FC is alive
            await self._request_fc("/exec_command", {"command": "echo 'ping'"})
            return True
        except Exception:
            return False

    async def discover(self, sandbox_id: str) -> bool:
        """
        Discover if the sandbox resources exist.
        """
        return True
        
    async def execute_command(self, sandbox_id: str, command: str) -> str:
        """
        Execute a command inside the FC environment.
        """
        # We assume the caller manages the directory or we wrap it.
        # For a robust implementation, the FC executor should handle CWD based on sandbox_id
        payload = {"command": command}
        response = await self._request_fc("/exec_command", payload)
        return response.get("output", "")
        
    async def read_file(self, sandbox_id: str, path: str) -> str:
        payload = {"path": path}
        response = await self._request_fc("/read_file", payload)
        return response.get("content", "")
        
    async def write_file(self, sandbox_id: str, path: str, content: str, append: bool = False) -> None:
        payload = {"path": path, "content": content, "append": append}
        await self._request_fc("/write_file", payload)

    async def list_dir(self, sandbox_id: str, path: str) -> list[str]:
        command = f"ls -1 {path}"
        output = await self.execute_command(sandbox_id, command)
        return [line for line in output.split("\\n") if line.strip()]

    def _extract_tenant_id(self, thread_id: str | None) -> str:
        if not thread_id:
            return "default"
        if thread_id.startswith("tenant_"):
            parts = thread_id.split("-", 1)
            if len(parts) > 1:
                return parts[0].replace("tenant_", "")
        return "default"

    async def _request_fc(self, path: str, json_data: dict) -> dict:
        url = f"{self.endpoint}{path}"
        try:
            response = await self._client.post(url, json=json_data, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Aliyun FC API error: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Failed to communicate with Aliyun FC: {e}")
            raise
