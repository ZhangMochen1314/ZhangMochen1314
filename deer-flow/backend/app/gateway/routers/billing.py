from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import jwt
import os

from app.gateway.database import get_db
from app.gateway.models import User, BillingLog, SkillPricing, PointPackage

router = APIRouter(prefix="/api/billing", tags=["billing"])

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "deepresvalue_super_secret_key_12345")
ALGORITHM = "HS256"

# A simple dependency to get the current user from the JWT token
async def get_current_user(token: str = Depends(lambda req: req.headers.get("Authorization", "").replace("Bearer ", "")), db: AsyncSession = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

class DeductRequest(BaseModel):
    amount: int
    action: str

@router.post("/deduct")
async def deduct_points(req: DeductRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
        
    # Lock the user row to prevent race conditions
    result = await db.execute(select(User).where(User.id == current_user.id).with_for_update())
    user = result.scalars().first()
    
    if user.credits < req.amount:
        raise HTTPException(status_code=400, detail="Insufficient credits")
        
    user.credits -= req.amount
    
    log = BillingLog(
        user_id=user.id,
        action=req.action,
        credits_change=-req.amount
    )
    db.add(log)
    
    await db.commit()
    return {"status": "success", "credits": user.credits}

@router.get("/me")
async def get_my_credits(current_user: User = Depends(get_current_user)):
    return {"credits": current_user.credits}

@router.get("/prices")
async def get_skill_prices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SkillPricing).order_by(SkillPricing.cost.asc()))
    prices = result.scalars().all()
    return [{"id": p.id, "skill_id": p.skill_id, "display_name": p.display_name, "cost": p.cost} for p in prices]

@router.get("/packages")
async def get_point_packages(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PointPackage).order_by(PointPackage.points.asc()))
    packages = result.scalars().all()
    return [{"id": p.id, "name": p.name, "points": p.points, "price": p.price, "is_recommended": p.is_recommended} for p in packages]
