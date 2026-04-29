import os


class TOSProvider:
    def __init__(self):
        self.endpoint = os.getenv("VOLCENGINE_TOS_ENDPOINT")
        self.bucket_name = os.getenv("VOLCENGINE_TOS_BUCKET")
        self.access_key_id = os.getenv("VOLCENGINE_ACCESS_KEY")
        self.access_key_secret = os.getenv("VOLCENGINE_SECRET_KEY")

        try:
            import tos  # type: ignore
        except Exception:
            tos = None

        self._tos = tos

    def _require_client(self):
        if self._tos is None:
            raise RuntimeError("TOS SDK not installed. Install volcengine TOS python sdk to enable STORAGE_PROVIDER=tos.")
        if not self.endpoint or not self.bucket_name or not self.access_key_id or not self.access_key_secret:
            raise RuntimeError("Missing TOS env (VOLCENGINE_TOS_ENDPOINT/BUCKET/VOLCENGINE_ACCESS_KEY/VOLCENGINE_SECRET_KEY).")

        auth = self._tos.Auth(self.access_key_id, self.access_key_secret)  # type: ignore[attr-defined]
        return self._tos.TosClientV2(self.endpoint, auth, self.bucket_name)  # type: ignore[attr-defined]

    def generate_presigned_url(self, object_name: str, method: str = "PUT", expiration: int = 3600) -> str:
        client = self._require_client()
        raise RuntimeError("TOSProvider.generate_presigned_url is not implemented in this build")

    def download_file(self, object_name: str, local_path: str) -> None:
        client = self._require_client()
        raise RuntimeError("TOSProvider.download_file is not implemented in this build")

