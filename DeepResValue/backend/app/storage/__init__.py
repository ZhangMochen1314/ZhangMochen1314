import os
from .provider import StorageProvider
from .oss_provider import OSSProvider
from .tos_provider import TOSProvider

from deerflow.config.storage_config import get_storage_config

_provider_instance: StorageProvider | None = None

def get_storage_provider() -> StorageProvider:
    global _provider_instance
    if _provider_instance is not None:
        return _provider_instance

    config = get_storage_config()
    if config.provider == "tos":
        _provider_instance = TOSProvider(
            access_key=os.environ.get("VOLCENGINE_TOS_ACCESS_KEY", ""),
            secret_key=os.environ.get("VOLCENGINE_TOS_SECRET_KEY", ""),
            endpoint=os.environ.get("VOLCENGINE_TOS_ENDPOINT", "tos-cn-beijing.volces.com"),
            region=os.environ.get("VOLCENGINE_TOS_REGION", "cn-beijing"),
            bucket_name=os.environ.get("VOLCENGINE_TOS_BUCKET", ""),
        )
    else:
        _provider_instance = OSSProvider(
            access_key=os.environ.get("ALIYUN_OSS_ACCESS_KEY", ""),
            secret_key=os.environ.get("ALIYUN_OSS_SECRET_KEY", ""),
            endpoint=os.environ.get("ALIYUN_OSS_ENDPOINT", ""),
            bucket_name=os.environ.get("ALIYUN_OSS_BUCKET", ""),
        )
    return _provider_instance
