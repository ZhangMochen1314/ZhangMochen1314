import os

import oss2


class OSSProvider:
    def __init__(self):
        self.endpoint = os.getenv("ALIYUN_OSS_ENDPOINT")
        self.bucket_name = os.getenv("BUCKET")
        self.access_key_id = os.getenv("ACCESS_KEY_ID")
        self.access_key_secret = os.getenv("SECRET")
        
        if self.access_key_id and self.access_key_secret and self.endpoint and self.bucket_name:
            auth = oss2.Auth(self.access_key_id, self.access_key_secret)
            self.bucket = oss2.Bucket(auth, self.endpoint, self.bucket_name)
        else:
            self.bucket = None

    def generate_presigned_url(self, object_name: str, method: str = 'PUT', expiration: int = 3600) -> str:
        if not self.bucket:
            raise ValueError("OSS client is not properly configured. Missing environment variables.")
        return self.bucket.sign_url(method, object_name, expiration)

    def download_file(self, object_name: str, local_path: str):
        if not self.bucket:
            raise ValueError("OSS client is not properly configured. Missing environment variables.")
        self.bucket.get_object_to_file(object_name, local_path)
