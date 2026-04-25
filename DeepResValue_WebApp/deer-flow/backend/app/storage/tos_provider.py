import os
import logging
from .base import StorageProvider

logger = logging.getLogger(__name__)

class TOSProvider(StorageProvider):
    """
    Volcengine TOS (Tinder Object Storage) provider implementation.
    Requires:
    - VOLCENGINE_TOS_ACCESS_KEY
    - VOLCENGINE_TOS_SECRET_KEY
    - VOLCENGINE_TOS_BUCKET
    - VOLCENGINE_TOS_REGION
    """

    def __init__(self):
        # We try to import tos here to avoid failure if the user hasn't installed the SDK
        try:
            import tos
        except ImportError:
            logger.error("volcengine-python-sdk is not installed. Run: pip install volcengine-python-sdk")
            self._tos_client = None
            return

        self._access_key = os.environ.get("VOLCENGINE_TOS_ACCESS_KEY")
        self._secret_key = os.environ.get("VOLCENGINE_TOS_SECRET_KEY")
        self._bucket = os.environ.get("VOLCENGINE_TOS_BUCKET")
        self._region = os.environ.get("VOLCENGINE_TOS_REGION", "cn-beijing")
        self._endpoint = f"tos-{self._region}.volces.com"
        
        if not all([self._access_key, self._secret_key, self._bucket]):
            logger.warning("TOS credentials are not fully configured in environment variables.")
            self._tos_client = None
        else:
            try:
                # Initialize TOS client v2
                self._tos_client = tos.TosClientV2(
                    self._access_key,
                    self._secret_key,
                    self._endpoint,
                    self._region
                )
            except Exception as e:
                logger.error(f"Failed to initialize TOS client: {e}")
                self._tos_client = None

    def generate_presigned_url(self, object_name: str, method: str = 'PUT', expiration: int = 3600) -> str:
        """
        Generate a presigned URL for direct client upload/download.
        """
        if not self._tos_client:
            raise ValueError("TOSClient is not initialized. Please check VOLCENGINE_TOS_* environment variables.")

        try:
            # TOS API expects HTTP method strings like "GET", "PUT"
            res = self._tos_client.pre_signed_url(
                method,
                self._bucket,
                object_name,
                expires=expiration
            )
            return res.signed_url
        except Exception as e:
            logger.error(f"Failed to generate TOS presigned URL: {e}")
            raise

    def download_file(self, object_name: str, local_path: str) -> None:
        """
        Download a file from TOS to the local filesystem.
        """
        if not self._tos_client:
            raise ValueError("TOSClient is not initialized. Please check VOLCENGINE_TOS_* environment variables.")

        try:
            self._tos_client.get_object_to_file(
                self._bucket,
                object_name,
                local_path
            )
        except Exception as e:
            logger.error(f"Failed to download file from TOS: {e}")
            raise