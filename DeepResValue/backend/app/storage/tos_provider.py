import asyncio
from typing import List
import tos

from .provider import StorageProvider


class TOSProvider(StorageProvider):
    """Volcengine TOS implementation of StorageProvider."""

    def __init__(self, access_key: str, secret_key: str, endpoint: str, region: str, bucket_name: str):
        self.bucket_name = bucket_name
        self.endpoint = endpoint
        self.client = tos.TosClientV2(
            access_key,
            secret_key,
            endpoint,
            region
        )

    async def upload_file(self, file_path: str, object_name: str) -> str:
        """Upload a file to the storage provider and return its URL."""
        await asyncio.to_thread(
            self.client.put_object_from_file,
            self.bucket_name,
            object_name,
            file_path
        )
        endpoint_host = self.endpoint.replace('https://', '').replace('http://', '')
        return f"https://{self.bucket_name}.{endpoint_host}/{object_name}"

    async def download_file(self, object_name: str, file_path: str) -> None:
        """Download a file from the storage provider to the local path."""
        await asyncio.to_thread(
            self.client.get_object_to_file,
            self.bucket_name,
            object_name,
            file_path
        )

    async def generate_presigned_url(self, object_name: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for downloading the object."""
        res = await asyncio.to_thread(
            self.client.pre_signed_url,
            tos.HttpMethodType.Http_Method_Get,
            bucket=self.bucket_name,
            key=object_name,
            expires=expires_in
        )
        return res.signed_url

    async def delete_file(self, object_name: str) -> None:
        """Delete a file from the storage provider."""
        await asyncio.to_thread(
            self.client.delete_object,
            self.bucket_name,
            object_name
        )

    async def list_files(self, prefix: str = "") -> List[str]:
        """List files in the storage provider with the given prefix."""
        def _list():
            files = []
            is_truncated = True
            next_marker = ""
            while is_truncated:
                out = self.client.list_objects(self.bucket_name, prefix=prefix, marker=next_marker)
                for obj in out.contents:
                    files.append(obj.key)
                is_truncated = out.is_truncated
                next_marker = out.next_marker
            return files
        return await asyncio.to_thread(_list)
