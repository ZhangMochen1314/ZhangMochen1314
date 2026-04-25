import datetime
import hashlib
import hmac
import logging
import os
import time
from typing import Any
from urllib.parse import quote

import requests

from .backend import SandboxBackend
from .sandbox_info import SandboxInfo

logger = logging.getLogger(__name__)


class VolcengineV4Auth:
    """Mock/Implementation of Volcengine V4 Signature.

    Generates the Authorization header for veFaaS API requests.
    """

    def __init__(self, access_key: str, secret_key: str, region: str = "cn-beijing", service: str = "vefaas"):
        self.access_key = access_key
        self.secret_key = secret_key
        self.region = region
        self.service = service

    def sign_request(self, method: str, url: str, headers: dict, body: bytes | str) -> dict:
        """Sign an HTTP request using Volcengine V4 signature.

        Returns the updated headers with Authorization and date headers.
        """
        # Mocking the actual V4 signature for now
        # In a real implementation, this would compute the canonical request, string to sign, and HMAC
        t = datetime.datetime.utcnow()
        amz_date = t.strftime("%Y%m%dT%H%M%SZ")
        datestamp = t.strftime("%Y%m%d")

        if isinstance(body, str):
            body = body.encode("utf-8")
        body_hash = hashlib.sha256(body or b"").hexdigest()

        headers = headers.copy()
        headers["X-Date"] = amz_date
        headers["X-Content-Sha256"] = body_hash

        # Mocking signature
        credential_scope = f"{datestamp}/{self.region}/{self.service}/request"
        signature = hmac.new(self.secret_key.encode("utf-8"), body_hash.encode("utf-8"), hashlib.sha256).hexdigest()

        auth_header = (
            f"HMAC-SHA256 Credential={self.access_key}/{credential_scope}, "
            f"SignedHeaders=host;x-date;x-content-sha256, Signature={signature}"
        )
        headers["Authorization"] = auth_header
        return headers


class VolcengineSandboxBackend(SandboxBackend):
    """Backend for provisioning sandboxes via Volcengine veFaaS API."""

    def __init__(self, endpoint: str = "https://vefaas.volcengineapi.com"):
        self.endpoint = endpoint.rstrip("/")
        self.access_key = os.environ.get("VOLCENGINE_ACCESS_KEY", "")
        self.secret_key = os.environ.get("VOLCENGINE_SECRET_KEY", "")
        self.auth = VolcengineV4Auth(self.access_key, self.secret_key)
        
        if not self.access_key or not self.secret_key:
            logger.warning("VOLCENGINE_ACCESS_KEY or VOLCENGINE_SECRET_KEY not set. API calls will fail.")

    def _make_request(self, method: str, path: str, json_data: dict[str, Any] | None = None) -> dict:
        url = f"{self.endpoint}{path}"
        body = ""
        headers = {"Content-Type": "application/json"}
        
        if json_data is not None:
            import json
            body = json.dumps(json_data)
            
        headers = self.auth.sign_request(method, url, headers, body)
        
        # In a real implementation, we would make the actual request
        # response = requests.request(method, url, headers=headers, data=body, timeout=10)
        # response.raise_for_status()
        # return response.json()
        
        # Mock response for now
        logger.info(f"Mocking Volcengine API request: {method} {url}")
        return {"SandboxId": "mock-volc-id", "SandboxUrl": "http://mock-vefaas-sandbox:8080"}

    def create(self, thread_id: str | None, sandbox_id: str, extra_mounts: list[tuple[str, str, bool]] | None = None) -> SandboxInfo:
        logger.info(f"Creating Volcengine sandbox {sandbox_id} for thread {thread_id}")
        payload = {
            "SandboxId": sandbox_id,
            "ThreadId": thread_id or "",
            "Mounts": extra_mounts or []
        }
        
        # Call veFaaS API to create sandbox
        resp = self._make_request("POST", "/CreateSandbox", json_data=payload)
        
        return SandboxInfo(
            sandbox_id=sandbox_id,
            sandbox_url=resp.get("SandboxUrl", f"http://{sandbox_id}:8080"),
            created_at=time.time()
        )

    def destroy(self, info: SandboxInfo) -> None:
        logger.info(f"Destroying Volcengine sandbox {info.sandbox_id}")
        self._make_request("POST", "/DestroySandbox", json_data={"SandboxId": info.sandbox_id})

    def is_alive(self, info: SandboxInfo) -> bool:
        try:
            resp = self._make_request("POST", "/GetSandboxStatus", json_data={"SandboxId": info.sandbox_id})
            return resp.get("Status") == "Running"
        except Exception as e:
            logger.error(f"Failed to check sandbox status: {e}")
            return False

    def discover(self, sandbox_id: str) -> SandboxInfo | None:
        try:
            resp = self._make_request("POST", "/GetSandboxStatus", json_data={"SandboxId": sandbox_id})
            if resp.get("Status") == "Running":
                return SandboxInfo(
                    sandbox_id=sandbox_id,
                    sandbox_url=resp.get("SandboxUrl", f"http://{sandbox_id}:8080"),
                    created_at=time.time()
                )
        except Exception:
            pass
        return None
