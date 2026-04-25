import os
from alipay import AliPay
from alipay.utils import AliPayConfig

# 读取支付宝相关环境变量
ALIPAY_APP_ID = os.getenv("ALIPAY_APP_ID", "")
ALIPAY_APP_PRIVATE_KEY = os.getenv("ALIPAY_APP_PRIVATE_KEY", "").replace("\\n", "\n")
ALIPAY_PUBLIC_KEY = os.getenv("ALIPAY_PUBLIC_KEY", "").replace("\\n", "\n")

# 是否使用沙箱环境
ALIPAY_DEBUG = os.getenv("ALIPAY_DEBUG", "True").lower() == "true"

def get_alipay_client():
    if not ALIPAY_APP_ID or not ALIPAY_APP_PRIVATE_KEY or not ALIPAY_PUBLIC_KEY:
        raise ValueError("AliPay configuration is missing.")
        
    alipay = AliPay(
        appid=ALIPAY_APP_ID,
        app_notify_url=None,  # 默认回调 URL
        app_private_key_string=ALIPAY_APP_PRIVATE_KEY,
        alipay_public_key_string=ALIPAY_PUBLIC_KEY,
        sign_type="RSA2",
        debug=ALIPAY_DEBUG,
        config=AliPayConfig(timeout=15)
    )
    return alipay
