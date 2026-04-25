import os
from alipay import AliPay
from alipay.utils import AliPayConfig

# 读取环境变量
ALIPAY_APP_ID = os.getenv("ALIPAY_APP_ID", "")
ALIPAY_APP_PRIVATE_KEY_STRING = os.getenv("ALIPAY_APP_PRIVATE_KEY_STRING", "")
ALIPAY_PUBLIC_KEY_STRING = os.getenv("ALIPAY_PUBLIC_KEY_STRING", "")
ALIPAY_DEBUG = os.getenv("ALIPAY_DEBUG", "True").lower() in ("true", "1", "t")

def get_alipay_client() -> AliPay | None:
    """
    初始化并返回 AliPay 客户端实例。如果未配置则返回 None。
    """
    if not ALIPAY_APP_ID or not ALIPAY_APP_PRIVATE_KEY_STRING or not ALIPAY_PUBLIC_KEY_STRING:
        # 为了在没有配置环境变量时也能启动项目，这里返回 None
        return None

    try:
        alipay = AliPay(
            appid=ALIPAY_APP_ID,
            app_notify_url=None,  # 默认回调 URL
            app_private_key_string=ALIPAY_APP_PRIVATE_KEY_STRING,
            alipay_public_key_string=ALIPAY_PUBLIC_KEY_STRING,
            sign_type="RSA2",  # RSA 或者 RSA2
            debug=ALIPAY_DEBUG,  # 默认 False, 若为 True 则使用沙箱环境
            config=AliPayConfig(timeout=15)
        )
        return alipay
    except Exception as e:
        import logging
        logging.error(f"Failed to initialize Alipay client: {e}")
        return None

alipay_client = get_alipay_client()
