from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from typing import Any

logger = logging.getLogger(__name__)

try:
    import fc2  # type: ignore
except Exception:  # pragma: no cover
    fc2 = None


@dataclass(frozen=True)
class FCConfig:
    access_key_id: str
    access_key_secret: str
    account_id: str
    region: str = "cn-hangzhou"
    service_name: str = "deeptrace-executor"
    function_name: str = "executor"
    timeout: int = 300

    @classmethod
    def from_env(cls) -> "FCConfig":
        access_key_id = os.getenv("ALIYUN_FC_ACCESS_KEY_ID") or os.getenv("ALIYUN_ACCESS_KEY_ID")
        access_key_secret = os.getenv("ALIYUN_FC_ACCESS_KEY_SECRET") or os.getenv("ALIYUN_ACCESS_KEY_SECRET")
        account_id = os.getenv("ALIYUN_FC_ACCOUNT_ID") or os.getenv("ALIYUN_ACCOUNT_ID")

        if not access_key_id or not access_key_secret or not account_id:
            raise RuntimeError("Missing Aliyun FC credentials in env (ALIYUN_FC_ACCESS_KEY_ID/SECRET and ALIYUN_FC_ACCOUNT_ID).")

        return cls(
            access_key_id=access_key_id,
            access_key_secret=access_key_secret,
            account_id=account_id,
            region=os.getenv("ALIYUN_FC_REGION", "cn-hangzhou"),
            service_name=os.getenv("ALIYUN_FC_SERVICE", "deeptrace-executor"),
            function_name=os.getenv("ALIYUN_FC_FUNCTION", "executor"),
            timeout=int(os.getenv("ALIYUN_FC_TIMEOUT", "300")),
        )

    @property
    def endpoint(self) -> str:
        return f"https://{self.account_id}.{self.region}.fc.aliyuncs.com"


class FCClient:
    def __init__(self, config: FCConfig | None = None):
        if fc2 is None:
            raise RuntimeError("Missing dependency 'fc2'. Install it in backend runtime to invoke Aliyun FC.")
        self.config = config or FCConfig.from_env()
        self._client = fc2.Client(
            endpoint=self.config.endpoint,
            accessKeyID=self.config.access_key_id,
            accessKeySecret=self.config.access_key_secret,
            timeout=self.config.timeout,
        )

    def invoke(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = self._client.invoke_function(
            self.config.service_name,
            self.config.function_name,
            payload=json.dumps(payload, ensure_ascii=False),
            headers={"x-fc-log-type": "Tail"},
        )

        data = response.data
        if isinstance(data, bytes):
            data = data.decode("utf-8")

        try:
            result = json.loads(data)
        except json.JSONDecodeError:
            result = {"raw_output": data}

        request_id = getattr(response, "request_id", "")
        if request_id:
            result["request_id"] = request_id
        return result

