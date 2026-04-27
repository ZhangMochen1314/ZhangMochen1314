import logging
import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Depends, Form, Response
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.gateway.deps import get_db_session, get_current_user
from app.auth.models import User
from app.billing.models import Order, Transaction
from app.billing.alipay_client import alipay_client

router = APIRouter(prefix="/billing", tags=["billing"])

logger = logging.getLogger(__name__)

class AlipayCheckoutRequest(BaseModel):
    product_id: str
    amount: float
    subject: str = "充值积分"
    return_url: Optional[str] = None

@router.post("/checkout/alipay")
async def create_alipay_checkout(
    req: AlipayCheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    if not alipay_client:
        raise HTTPException(status_code=500, detail="Alipay client not configured")

    # 1. 创建订单
    order = Order(
        user_id=current_user.id,
        product_id=req.product_id,
        amount=req.amount,
        status="pending"
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # 生成一个 out_trade_no (例如: order_id + uuid)
    out_trade_no = f"ORDER_{order.id}_{uuid.uuid4().hex[:8]}"

    # 2. 创建交易记录
    transaction = Transaction(
        user_id=current_user.id,
        amount=req.amount,
        currency="cny",
        status="pending",
        alipay_trade_no=out_trade_no
    )
    db.add(transaction)
    await db.commit()

    # 3. 生成支付宝 PC 网站支付重定向链接 (Page Pay)
    # 调用 alipay.api_alipay_trade_page_pay
    order_string = alipay_client.api_alipay_trade_page_pay(
        out_trade_no=out_trade_no,
        total_amount=str(req.amount),
        subject=req.subject,
        return_url=req.return_url,
        notify_url="https://yourdomain.com/api/billing/webhook/alipay" # 实际需要配置
    )

    # 4. 返回支付链接给前端
    # 如果是沙箱环境
    if alipay_client.debug:
        pay_url = f"https://openapi-sandbox.dl.alipaydev.com/gateway.do?{order_string}"
    else:
        pay_url = f"https://openapi.alipay.com/gateway.do?{order_string}"

    return {"pay_url": pay_url, "order_id": order.id, "out_trade_no": out_trade_no}

@router.post("/webhook/alipay")
async def alipay_webhook(request: Request, db: AsyncSession = Depends(get_db_session)):
    """
    Alipay webhook endpoint for handling payment events.
    """
    if not alipay_client:
        raise HTTPException(status_code=500, detail="Alipay client not configured")

    # 获取请求内容
    form_data = await request.form()
    data = dict(form_data)
    
    signature = data.pop("sign", None)
    sign_type = data.pop("sign_type", None)

    # 验证签名
    success = alipay_client.verify(data, signature)
    if not success:
        logger.error("Alipay signature verification failed")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 处理支付成功
    trade_status = data.get("trade_status")
    out_trade_no = data.get("out_trade_no", "")
    
    if trade_status in ("TRADE_SUCCESS", "TRADE_FINISHED"):
        # out_trade_no 格式: ORDER_{order_id}_{uuid}
        try:
            parts = out_trade_no.split("_")
            order_id = int(parts[1])
        except (IndexError, ValueError):
            logger.error(f"Invalid out_trade_no format: {out_trade_no}")
            return Response(content="success", media_type="text/plain") # 返回 success 避免支付宝重复发送

        # 更新 Transaction 状态
        result = await db.execute(select(Transaction).where(Transaction.alipay_trade_no == out_trade_no))
        transaction = result.scalars().first()
        if transaction and transaction.status != "succeeded":
            transaction.status = "succeeded"
            
            # 更新 Order 状态
            order_result = await db.execute(select(Order).where(Order.id == order_id))
            order = order_result.scalars().first()
            if order and order.status != "succeeded":
                order.status = "succeeded"
                
                # 为用户增加 credits
                user_result = await db.execute(select(User).where(User.id == order.user_id))
                user = user_result.scalars().first()
                if user:
                    # 简单逻辑：每支付 1 元增加 100 积分
                    user.credits += int(order.amount * 100)
            
            await db.commit()
            logger.info(f"Payment successful for order {order_id}")

    return Response(content="success", media_type="text/plain")

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Stripe webhook endpoint for handling payment events.
    """
    try:
        _payload = await request.body()
        _sig_header = request.headers.get("stripe-signature")

        # In a real application, you would verify the signature using stripe.Webhook.construct_event
        # event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        
        # For now, we just parse the JSON
        event = await request.json()
        
        event_type = event.get("type")
        logger.info(f"Received Stripe webhook event: {event_type}")

        if event_type == "payment_intent.succeeded":
            payment_intent = event.get("data", {}).get("object", {})
            # Handle successful payment
            logger.info(f"PaymentIntent was successful: {payment_intent.get('id')}")
        elif event_type == "payment_intent.payment_failed":
            payment_intent = event.get("data", {}).get("object", {})
            # Handle failed payment
            logger.info(f"PaymentIntent failed: {payment_intent.get('id')}")
        else:
            logger.info(f"Unhandled event type: {event_type}")

        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error handling Stripe webhook: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
