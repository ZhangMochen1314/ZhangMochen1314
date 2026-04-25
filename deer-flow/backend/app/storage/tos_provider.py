import os
import asyncio
import tos
from typing import List

from .provider import StorageProvider

class TOSProvider(StorageProvider):
    def __init__(self):
        self.endpoint = os.getenv("VOLCENGINE_TOS_ENDPOINT")
        self.region = os.getenv("VOLCENGINE_TOS_REGION")
        self.bucket_name = os.getenv("VOLCENGINE_TOS_BUCKET")
        self.access_key_id = os.getenv("VOLCENGINE_ACCESS_KEY_ID")
        self.access_key_secret = os.getenv("VOLCENGINE_ACCESS_KEY_SECRET")
        self._client = None
        
    @property
    def client(self):
        if self._client is None:
            # Re-fetch to support lazy initialization
            self.endpoint = os.getenv("VOLCENGINE_TOS_ENDPOINT", self.endpoint)
            self.region = os.getenv("VOLCENGINE_TOS_REGION", self.region)
            self.bucket_name = os.getenv("VOLCENGINE_TOS_BUCKET", self.bucket_name)
            self.access_key_id = os.getenv("VOLCENGINE_ACCESS_KEY_ID", self.access_key_id)
            self.access_key_secret = os.getenv("VOLCENGINE_ACCESS_KEY_SECRET", self.access_key_secret)
            
            if self.access_key_id and self.access_key_secret and self.endpoint and self.region:
                self._client = tos.TosClientV2(
                    self.access_key_id,
                    self.access_key_secret,
                    self.endpoint,
                    self.region
                )
        return self._client

    def _check_client(self):
        if not self.client or not self.bucket_name:
            raise ValueError("TOS client is not properly configured. Missing environment variables.")

    async def upload_file(self, object_name: str, local_path: str) -> None:
        self._check_client()
        await asyncio.to_thread(self.client.put_object_from_file, self.bucket_name, object_name, local_path)

    async def download_file(self, object_name: str, local_path: str) -> None:
        self._check_client()
        await asyncio.to_thread(self.client.get_object_to_file, self.bucket_name, object_name, local_path)

    async def generate_presigned_url(self, object_name: str, method: str = 'PUT', expiration: int = 3600) -> str:
        self._check_client()
        
        http_method = method.upper()
        if http_method == 'GET':
            tos_method = tos.HttpMethodType.Http_Method_Get
        elif http_method == 'PUT':
            tos_method = tos.HttpMethodType.Http_Method_Put
        elif http_method == 'POST':
            tos_method = tos.HttpMethodType.Http_Method_Post
        elif http_method == 'DELETE':
            tos_method = tos.HttpMethodType.Http_Method_Delete
        else:
            tos_method = tos.HttpMethodType.Http_Method_Get

        def _sign():
            return self.client.pre_signed_url(
                http_method=tos_method,
                bucket=self.bucket_name,
                key=object_name,
                expires=expiration
            ).signed_url
        return await asyncio.to_thread(_sign)

    async def delete_file(self, object_name: str) -> None:
        self._check_client()
        await asyncio.to_thread(self.client.delete_object, self.bucket_name, object_name)

    async def list_files(self, prefix: str = "") -> List[str]:
        self._check_client()
        def _list():
            is_truncated = True
            marker = ""
            keys = []
            while is_truncated:
                out = self.client.list_objects(self.bucket_name, prefix=prefix, marker=marker)
                for content in out.contents:
                    keys.append(content.key)
                is_truncated = out.is_truncated
                marker = out.next_marker
            return keys
        return await asyncio.to_thread(_list)
