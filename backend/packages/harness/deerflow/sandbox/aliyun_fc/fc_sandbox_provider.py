import os
import logging
from typing import Optional, List
from pathlib import Path

from deerflow.sandbox.sandbox import Sandbox
from deerflow.sandbox.sandbox_provider import SandboxProvider
from deerflow.sandbox.aliyun_fc.fc_sandbox import AliyunFCSandbox

logger = logging.getLogger(__name__)

class AliyunFCSandboxProvider(SandboxProvider):
    """Provides Aliyun FC-based sandboxes."""
    
    uses_thread_data_mounts = False
    
    def __init__(self):
        self.endpoint = os.getenv("ALIYUN_FC_ENDPOINT")
        self.function_name = os.getenv("ALIYUN_FC_FUNCTION", "deeptrace-func")
        self.access_key_id = os.getenv("ALIYUN_ACCESS_KEY_ID")
        self.access_key_secret = os.getenv("ALIYUN_ACCESS_KEY_SECRET")
        
        self.oss_endpoint = os.getenv("ALIYUN_OSS_ENDPOINT")
        self.oss_bucket = os.getenv("ALIYUN_OSS_BUCKET")
        self.oss_ak_id = os.getenv("ALIYUN_OSS_ACCESS_KEY_ID", self.access_key_id)
        self.oss_ak_secret = os.getenv("ALIYUN_OSS_ACCESS_KEY_SECRET", self.access_key_secret)

        if not all([self.endpoint, self.access_key_id, self.access_key_secret, self.oss_endpoint, self.oss_bucket]):
            logger.warning("Missing Aliyun FC/OSS credentials. AliyunFCSandbox will not work correctly.")

    def get_sandbox(self, id: str) -> Sandbox:
        """Get or create an Aliyun FC Sandbox for the given ID."""
        return AliyunFCSandbox(
            id=id,
            fc_endpoint=self.endpoint,
            fc_function_name=self.function_name,
            access_key_id=self.access_key_id,
            access_key_secret=self.access_key_secret,
            oss_endpoint=self.oss_endpoint,
            oss_bucket=self.oss_bucket,
            oss_ak_id=self.oss_ak_id,
            oss_ak_secret=self.oss_ak_secret
        )

    def cleanup_sandbox(self, id: str) -> None:
        """Cleanup sandbox resources. For FC, this might mean deleting the OSS prefix."""
        # Optional: Implement OSS cleanup here to save space
        pass
