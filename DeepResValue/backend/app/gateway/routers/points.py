from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import User, PointsLedger

router = APIRouter(prefix="/api/points", tags=["points"])

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

@router.get("/balance", response_model=PointsResponse)
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

@router.post("/top-up", response_model=PointsResponse)
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
        
    current_points = getattr(user, "points", 0.0)
    new_balance = current_points + body.amount
    user.points = new_balance
    
    ledger = PointsLedger(
        user_id=user.id,
        transaction_type="recharge",
        amount=body.amount,
        balance_after=new_balance,
        description=f"Top-up of {body.amount} points"
    )
    db.add(ledger)
    db.commit()
    db.refresh(user)
    
    return {"user_id": user.id, "points": new_balance}

@router.get("/ledger", response_model=list[LedgerEntryResponse])
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
