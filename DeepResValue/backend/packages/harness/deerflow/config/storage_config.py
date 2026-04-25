from pydantic import BaseModel, Field

class StorageConfig(BaseModel):
    """Configuration for storage providers."""
    provider: str = Field(default="oss", description="Storage provider to use (oss, tos)")
    presigned_url_expire_seconds: int = Field(default=3600, description="Expiration time for presigned URLs")

_storage_config: StorageConfig | None = None

def load_storage_config_from_dict(data: dict) -> None:
    global _storage_config
    _storage_config = StorageConfig.model_validate(data)

def get_storage_config() -> StorageConfig:
    if _storage_config is None:
        return StorageConfig()
    return _storage_config
