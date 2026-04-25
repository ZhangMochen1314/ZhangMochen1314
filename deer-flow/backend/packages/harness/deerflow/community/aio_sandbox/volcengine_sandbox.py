"""Volcengine Sandbox Backend for provisioning veFaaS sandboxes."""

import logging
import os
import time

from agent_sandbox.providers.volcengine import VolcengineProvider

from .backend import SandboxBackend
from .sandbox_info import SandboxInfo

logger = logging.getLogger(__name__)

class VolcengineSandboxBackend(SandboxBackend):
    """Sandbox backend that uses Volcengine veFaaS to provision sandboxes.
    
    This backend dynamically provisions a cloud sandbox instance via veFaaS
    and accesses it via the API Gateway endpoint.
    """

    def __init__(self, function_id: str | None = None):
        ak = os.environ.get("VOLCENGINE_ACCESS_KEY")
        sk = os.environ.get("VOLCENGINE_SECRET_KEY")
        self.function_id = function_id or os.environ.get("VEFAAS_FUNCTION_ID")

        if not ak or not sk or not self.function_id:
            raise ValueError(
                "VOLCENGINE_ACCESS_KEY, VOLCENGINE_SECRET_KEY, and VEFAAS_FUNCTION_ID "
                "must be set in environment variables to use VolcengineSandboxBackend"
            )
            
        self.provider = VolcengineProvider(access_key=ak, secret_key=sk)
        
    def _get_sandbox_url(self, vefaas_sandbox_id: str) -> str:
        """Get the API Gateway endpoint for a given sandbox."""
        info = self.provider.get_sandbox(self.function_id, vefaas_sandbox_id)
        if isinstance(info, Exception):
            raise info
            
        domains = info.get("domains", [])
        if not domains:
            raise RuntimeError(f"No domains found for veFaaS sandbox {vefaas_sandbox_id}")
            
        # Prefer HTTPS if available, or just the first domain
        for domain_info in domains:
            domain = domain_info.get("domain", "")
            if domain:
                if not domain.startswith("http"):
                    domain = f"https://{domain}"
                return domain
                
        raise RuntimeError(f"No valid domains found for veFaaS sandbox {vefaas_sandbox_id}")

    def create(self, thread_id: str, sandbox_id: str, extra_mounts: list[tuple[str, str, bool]] | None = None) -> SandboxInfo:
        logger.info(f"Creating veFaaS sandbox for {sandbox_id} (thread {thread_id})")
        
        metadata = {"deerflow_sandbox_id": sandbox_id}
        if thread_id:
            metadata["thread_id"] = thread_id

        # Create sandbox via VolcengineProvider
        vefaas_sandbox_id = self.provider.create_sandbox(
            function_id=self.function_id,
            timeout=60,  # 60 minutes timeout for the sandbox instance
            metadata=metadata
        )
        
        if isinstance(vefaas_sandbox_id, Exception):
            raise RuntimeError(f"Failed to create veFaaS sandbox: {vefaas_sandbox_id}") from vefaas_sandbox_id

        logger.info(f"veFaaS sandbox created with ID {vefaas_sandbox_id}")
        
        # Wait a moment for the gateway to be ready
        time.sleep(2)
        
        sandbox_url = self._get_sandbox_url(vefaas_sandbox_id)
        
        return SandboxInfo(
            sandbox_id=sandbox_id,
            sandbox_url=sandbox_url,
            container_id=vefaas_sandbox_id,
            created_at=time.time(),
        )

    def destroy(self, info: SandboxInfo) -> None:
        if not info.container_id:
            logger.warning(f"No veFaaS sandbox ID found in SandboxInfo for {info.sandbox_id}")
            return
            
        logger.info(f"Destroying veFaaS sandbox {info.container_id}")
        result = self.provider.delete_sandbox(self.function_id, info.container_id)
        if isinstance(result, Exception):
            logger.error(f"Failed to destroy veFaaS sandbox {info.container_id}: {result}")
            raise result

    def is_alive(self, info: SandboxInfo) -> bool:
        if not info.container_id:
            return False
            
        result = self.provider.get_sandbox(self.function_id, info.container_id)
        if isinstance(result, Exception):
            return False
            
        status = result.get("status")
        # veFaaS sandbox status: "Running", "Pending", "Failed", etc.
        return status in ("Running", "Pending")

    def discover(self, sandbox_id: str) -> SandboxInfo | None:
        # We need to find the sandbox by metadata {"deerflow_sandbox_id": sandbox_id}
        sandboxes = self.provider.list_sandboxes(self.function_id, metadata={"deerflow_sandbox_id": sandbox_id})
        
        if isinstance(sandboxes, Exception):
            logger.error(f"Failed to list veFaaS sandboxes: {sandboxes}")
            return None
            
        if not sandboxes:
            return None
            
        # Find the active one
        for sb in sandboxes:
            if sb.get("status") in ("Running", "Pending"):
                vefaas_sandbox_id = sb.get("id") or sb.get("sandbox_id")
                if not vefaas_sandbox_id:
                    continue
                    
                try:
                    sandbox_url = self._get_sandbox_url(vefaas_sandbox_id)
                    return SandboxInfo(
                        sandbox_id=sandbox_id,
                        sandbox_url=sandbox_url,
                        container_id=vefaas_sandbox_id,
                        created_at=time.time(), # We don't have the exact creation time
                    )
                except Exception as e:
                    logger.warning(f"Found veFaaS sandbox {vefaas_sandbox_id} but failed to get URL: {e}")
                    continue
                    
        return None
