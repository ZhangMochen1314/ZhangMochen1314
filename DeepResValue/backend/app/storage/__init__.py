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
    if config.provider == "oss":
        logger.info("Initializing OSS Storage Provider")
        from .oss_provider import OSSProvider
        _provider_instance = OSSProvider()
        return _provider_instance
    else:
        logger.warning(f"Unsupported storage provider '{config.provider}', falling back to OSS")
        from .oss_provider import OSSProvider
        _provider_instance = OSSProvider()
        return _provider_instance
