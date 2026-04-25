from abc import ABC, abstractmethod
from typing import List, Optional

class StorageProvider(ABC):
    """Abstract base class for storage providers."""

    @abstractmethod
    async def upload_file(self, file_path: str, object_name: str) -> str:
        """Upload a file to the storage provider and return its URL."""
        pass

    @abstractmethod
    async def download_file(self, object_name: str, file_path: str) -> None:
        """Download a file from the storage provider to the local path."""
        pass

    @abstractmethod
    async def generate_presigned_url(self, object_name: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for downloading the object."""
        pass

    @abstractmethod
    async def delete_file(self, object_name: str) -> None:
        """Delete a file from the storage provider."""
        pass

    @abstractmethod
    async def list_files(self, prefix: str = "") -> List[str]:
        """List files in the storage provider with the given prefix."""
        pass
