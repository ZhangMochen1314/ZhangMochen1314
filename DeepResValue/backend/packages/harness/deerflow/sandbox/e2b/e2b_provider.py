import logging
from typing import Dict, Optional
from e2b_code_interpreter import Sandbox as E2BCoreSandbox
from deerflow.sandbox.sandbox_provider import SandboxProvider
from deerflow.sandbox.sandbox import Sandbox
from .e2b_sandbox import E2BSandbox

logger = logging.getLogger(__name__)

class E2BSandboxProvider(SandboxProvider):
    """
    Provider for E2B Cloud Sandbox.
    Manages the lifecycle of remote secure Python environments.
    """
    def __init__(self, template: str = "base"):
        self.template = template
        self.active_sandboxes: Dict[str, E2BCoreSandbox] = {}
        self._warm_pool = []

    def acquire(self, thread_id: str | None = None) -> str:
        """Acquires a new remote E2B sandbox, mapping it to a thread ID."""
        logger.info(f"Acquiring E2B Sandbox for thread {thread_id}...")
        
        # If there's an active sandbox for this thread, reuse it
        if thread_id and thread_id in self.active_sandboxes:
            logger.debug(f"Reusing existing E2B Sandbox for thread {thread_id}")
            return thread_id
            
        try:
            # Create a new remote Sandbox instance using E2B SDK
            # Uses API key from environment variable E2B_API_KEY automatically
            new_sandbox = E2BCoreSandbox(template=self.template)
            sandbox_id = thread_id if thread_id else f"e2b-sandbox-{id(new_sandbox)}"
            
            self.active_sandboxes[sandbox_id] = new_sandbox
            logger.info(f"Successfully launched E2B Sandbox {sandbox_id}")
            
            # Setup base directory
            new_sandbox.commands.run("mkdir -p /home/user/workspace")
            return sandbox_id
        except Exception as e:
            logger.error(f"Failed to acquire E2B Sandbox: {e}")
            raise RuntimeError(f"E2B API error: {e}")

    def get(self, sandbox_id: str) -> Optional[Sandbox]:
        """Returns the E2BSandbox adapter instance for the given ID."""
        core_sandbox = self.active_sandboxes.get(sandbox_id)
        if core_sandbox:
            return E2BSandbox(core_sandbox, root_dir="/home/user/workspace")
        return None

    def release(self, sandbox_id: str) -> None:
        """Kills and releases the remote E2B sandbox instance."""
        core_sandbox = self.active_sandboxes.pop(sandbox_id, None)
        if core_sandbox:
            try:
                core_sandbox.kill()
                logger.info(f"Released E2B Sandbox {sandbox_id}")
            except Exception as e:
                logger.error(f"Error releasing E2B Sandbox {sandbox_id}: {e}")
