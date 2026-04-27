import oss2
import os
import logging
from typing import Optional, List, Union

logger = logging.getLogger(__name__)

class OSSManager:
    """
    OSS文件管理器，用于封装阿里云 OSS2 的常用操作
    """
    def __init__(
        self,
        access_key_id: str,
        access_key_secret: str,
        endpoint: str,
        bucket_name: str
    ):
        self.access_key_id = access_key_id
        self.access_key_secret = access_key_secret
        self.endpoint = endpoint
        self.bucket_name = bucket_name
        
        # 初始化 Auth 和 Bucket
        self.auth = oss2.Auth(access_key_id, access_key_secret)
        self.bucket = oss2.Bucket(self.auth, endpoint, bucket_name)
        
    def upload_file(self, object_name: str, local_file_path: str) -> bool:
        """
        上传本地文件到 OSS
        """
        try:
            logger.info(f"Uploading file {local_file_path} to {object_name}")
            self.bucket.put_object_from_file(object_name, local_file_path)
            return True
        except Exception as e:
            logger.error(f"Failed to upload file to OSS: {e}")
            raise e

    def download_file(self, object_name: str, local_file_path: str) -> bool:
        """
        从 OSS 下载文件到本地
        """
        try:
            logger.info(f"Downloading {object_name} to {local_file_path}")
            self.bucket.get_object_to_file(object_name, local_file_path)
            return True
        except oss2.exceptions.NoSuchKey:
            logger.warning(f"Object {object_name} not found in OSS")
            return False
        except Exception as e:
            logger.error(f"Failed to download file from OSS: {e}")
            raise e
            
    def put_object(self, object_name: str, content: Union[bytes, str]) -> bool:
        """
        直接上传内容到 OSS
        """
        try:
            self.bucket.put_object(object_name, content)
            return True
        except Exception as e:
            logger.error(f"Failed to put object to OSS: {e}")
            raise e
            
    def get_object(self, object_name: str) -> Optional[bytes]:
        """
        从 OSS 获取对象内容
        """
        try:
            result = self.bucket.get_object(object_name)
            return result.read()
        except oss2.exceptions.NoSuchKey:
            return None
        except Exception as e:
            logger.error(f"Failed to get object from OSS: {e}")
            raise e

    def generate_presigned_url(self, object_name: str, method: str = 'GET', expiration: int = 3600) -> str:
        """
        生成预签名 URL
        method: 'GET' 为下载预签名, 'PUT' 为上传预签名
        """
        try:
            url = self.bucket.sign_url(method, object_name, expiration)
            return url
        except Exception as e:
            logger.error(f"Failed to generate presigned URL: {e}")
            raise e
            
    def list_objects(self, prefix: str = '') -> List[str]:
        """
        列出指定前缀的对象
        """
        objects = []
        try:
            for obj in oss2.ObjectIterator(self.bucket, prefix=prefix):
                objects.append(obj.key)
            return objects
        except Exception as e:
            logger.error(f"Failed to list objects in OSS: {e}")
            raise e
            
    def delete_object(self, object_name: str) -> bool:
        """
        删除对象
        """
        try:
            self.bucket.delete_object(object_name)
            return True
        except Exception as e:
            logger.error(f"Failed to delete object from OSS: {e}")
            raise e
