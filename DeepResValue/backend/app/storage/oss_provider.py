import asyncio
from typing import List
import oss2

from .provider import StorageProvider


class OSSProvider(StorageProvider):
    """Aliyun OSS implementation of StorageProvider."""

    def __init__(self, access_key: str, secret_key: str, endpoint: str, bucket_name: str):
        self.auth = oss2.Auth(access_key, secret_key)
        self.bucket = oss2.Bucket(self.auth, endpoint, bucket_name)
        self.bucket_name = bucket_name
        self.endpoint = endpoint

    async def upload_file(self, file_path: str, object_name: str) -> str:
        """Upload a file to the storage provider and return its URL."""
        await asyncio.to_thread(self.bucket.put_object_from_file, object_name, file_path)
        endpoint_host = self.endpoint.replace('https://', '').replace('http://', '')
        return f"https://{self.bucket_name}.{endpoint_host}/{object_name}"

    async def download_file(self, object_name: str, file_path: str) -> None:
        """Download a file from the storage provider to the local path."""
        await asyncio.to_thread(self.bucket.get_object_to_file, object_name, file_path)

    async def generate_presigned_url(self, object_name: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for downloading the object."""
        return await asyncio.to_thread(self.bucket.sign_url, 'GET', object_name, expires_in)

    async def delete_file(self, object_name: str) -> None:
        """Delete a file from the storage provider."""
        await asyncio.to_thread(self.bucket.delete_object, object_name)

    async def list_files(self, prefix: str = "") -> List[str]:
        """List files in the storage provider with the given prefix."""
        def _list():
            return [obj.key for obj in oss2.ObjectIterator(self.bucket, prefix=prefix)]
        return await asyncio.to_thread(_list)
