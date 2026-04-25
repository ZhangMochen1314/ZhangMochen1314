from abc import ABC, abstractmethod
from typing import List, Optional, Any

class StorageProvider(ABC):
    """
    Abstract base class for object storage providers.
    """

    @abstractmethod
    async def upload_file(self, object_name: str, local_path: str) -> None:
        """Upload a local file to storage."""
        pass

    @abstractmethod
    async def download_file(self, object_name: str, local_path: str) -> None:
        """Download a file from storage to a local path."""
        pass

    @abstractmethod
    async def generate_presigned_url(self, object_name: str, method: str = 'PUT', expiration: int = 3600) -> str:
        """Generate a presigned URL for an object."""
        pass

    @abstractmethod
    async def delete_file(self, object_name: str) -> None:
        """Delete a file from storage."""
        pass

    @abstractmethod
    async def list_files(self, prefix: str = "") -> List[str]:
        """List files in storage, optionally filtered by prefix."""
        pass
