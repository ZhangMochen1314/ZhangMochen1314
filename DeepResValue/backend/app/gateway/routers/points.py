from fastapi import APIRouter, Depends, HTTPException, Request, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid
import os
from datetime import datetime, timezone

from app.database import get_db
from app.models import User, PointsLedger, Order
from app.services.payment import get_alipay_client

ALIPAY_RETURN_URL = os.getenv("ALIPAY_RETURN_URL", "http://localhost:3000/payment/success")
ALIPAY_NOTIFY_URL = os.getenv("ALIPAY_NOTIFY_URL", "http://localhost:8000/api/webhooks/alipay")

router = APIRouter(prefix="/api", tags=["points"])

class TopUpRequest(BaseModel):
    amount: float

class PointsResponse(BaseModel):
    user_id: int
    points: float

class LedgerEntryResponse(BaseModel):
    id: int
    transaction_type: str
    amount: float
    balance_after: float
    description: str | None
    created_at: str

class TopUpResponse(BaseModel):
    order_no: str
    pay_url: str

@router.get("/points/balance", response_model=PointsResponse)
async def get_balance(
    request: Request,
    db: Session = Depends(get_db)
):
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"user_id": user.id, "points": getattr(user, "points", 0.0)}

@router.post("/points/top-up", response_model=TopUpResponse)
async def top_up(
    body: TopUpRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="Top-up amount must be positive")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    order_no = f"ORD{uuid.uuid4().hex[:12].upper()}"
    money_amount = body.amount 
    points_amount = body.amount
    
    order = Order(
        order_no=order_no,
        user_id=user.id,
        amount=money_amount,
        points=points_amount,
        status="pending",
        payment_method="alipay"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    alipay = get_alipay_client()
    
    order_string = alipay.api_alipay_trade_page_pay(
        out_trade_no=order_no,
        total_amount=str(money_amount),
        subject=f"Top up {points_amount} points",
        return_url=ALIPAY_RETURN_URL,
        notify_url=ALIPAY_NOTIFY_URL
    )
    
    gateway = "https://openapi-sandbox.dl.alipaydev.com/gateway.do" if alipay.debug else "https://openapi.alipay.com/gateway.do"
    pay_url = f"{gateway}?{order_string}"
    
    return {"order_no": order_no, "pay_url": pay_url}

@router.get("/points/ledger", response_model=list[LedgerEntryResponse])
async def get_ledger(
    request: Request,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    entries = db.query(PointsLedger).filter(PointsLedger.user_id == user_id).order_by(PointsLedger.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": entry.id,
            "transaction_type": entry.transaction_type,
            "amount": entry.amount,
            "balance_after": entry.balance_after,
            "description": entry.description,
            "created_at": entry.created_at.isoformat() if entry.created_at else ""
        }
        for entry in entries
    ]

@router.post("/webhooks/alipay")
async def alipay_webhook(request: Request, db: Session = Depends(get_db)):
    form_data = await request.form()
    data = dict(form_data)
    
    signature = data.pop("sign", None)
    if not signature:
        return "fail"
        
    alipay = get_alipay_client()
    success = alipay.verify(data, signature)
    
    if success and data.get("trade_status") in ("TRADE_SUCCESS", "TRADE_FINISHED"):
        order_no = data.get("out_trade_no")
        alipay_trade_no = data.get("trade_no")
        
        order = db.query(Order).filter(Order.order_no == order_no).first()
        if order and order.status == "pending":
            order.status = "paid"
            order.alipay_trade_no = alipay_trade_no
            order.paid_at = datetime.now(timezone.utc)
            
            user = db.query(User).filter(User.id == order.user_id).first()
            if user:
                current_points = getattr(user, "points", 0.0)
                new_balance = current_points + order.points
                user.points = new_balance
                
                ledger = PointsLedger(
                    user_id=user.id,
                    transaction_type="recharge",
                    amount=order.points,
                    balance_after=new_balance,
                    description=f"Alipay top-up of {order.points} points (Order: {order_no})"
                )
                db.add(ledger)
            
            db.commit()
            
    return "success"
