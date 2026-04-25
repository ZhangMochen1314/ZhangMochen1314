from typing import Protocol, Optional
import os

class StorageProvider(Protocol):
    """
    Abstract interface for object storage providers (e.g. OSS, TOS).
    """
    
    def generate_presigned_url(self, object_name: str, method: str = 'PUT', expiration: int = 3600) -> str:
        """
        Generate a presigned URL for direct client upload/download.
        """
        ...
        
    def download_file(self, object_name: str, local_path: str) -> None:
        """
        Download a file from object storage to the local filesystem.
        """
        ...

def get_storage_provider() -> StorageProvider:
    """
    Factory function to get the configured storage provider.
    """
    import yaml
    from pathlib import Path
    
    # Simple config parser for the provider choice
    config_path = Path(__file__).parent.parent.parent.parent / "config.yaml"
    provider_name = "oss"
    
    if config_path.exists():
        try:
            with open(config_path, "r") as f:
                config = yaml.safe_load(f)
                provider_name = config.get("storage", {}).get("provider", "oss")
        except Exception:
            pass
            
    if provider_name.lower() == "tos":
        from app.storage.tos_provider import TOSProvider
        return TOSProvider()
    else:
        from app.storage.oss_provider import OSSProvider
        return OSSProvider()