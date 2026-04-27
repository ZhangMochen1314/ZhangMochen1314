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
    from app.storage.oss_provider import OSSProvider
    return OSSProvider()