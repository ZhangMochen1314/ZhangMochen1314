from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List

from app.gateway.database import get_db
from app.gateway.models import SystemConfig, InviteCode, User
from sqlalchemy.orm import selectinload

router = APIRouter(prefix="/api/admin", tags=["admin"])

class ConfigUpdate(BaseModel):
    key: str
    value: str
    description: str | None = None

# MVP Note: Role checks for 'admin' should be implemented via JWT dependency here.

@router.get("/configs")
async def get_configs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SystemConfig))
    configs = result.scalars().all()
    return [{"key": c.key, "value": c.value, "description": c.description} for c in configs]

@router.post("/configs")
async def update_config(req: ConfigUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SystemConfig).where(SystemConfig.key == req.key))
    config = result.scalars().first()
    if config:
        config.value = req.value
        if req.description is not None:
            config.description = req.description
    else:
        config = SystemConfig(key=req.key, value=req.value, description=req.description)
        db.add(config)
    await db.commit()
    return {"status": "success", "key": req.key, "value": req.value}

@router.post("/generate_beta_code")
async def generate_beta_code(code: str, db: AsyncSession = Depends(get_db)):
    """Generate a master/beta code with no owner"""
    # Check if code already exists
    result = await db.execute(select(InviteCode).where(InviteCode.code == code))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Invite code already exists")
        
    new_invite = InviteCode(code=code, owner_id=None)
    db.add(new_invite)
    await db.commit()
    return {"status": "success", "code": code}

@router.get("/invite_codes")
async def list_invite_codes(db: AsyncSession = Depends(get_db)):
    """List all invite codes and their usage stats"""
    result = await db.execute(
        select(InviteCode).options(selectinload(InviteCode.owner)).order_by(InviteCode.created_at.desc())
    )
    codes = result.scalars().all()
    
    return [
        {
            "id": c.id,
            "code": c.code,
            "type": "Master Beta Code" if c.owner_id is None else "User Code",
            "owner_email": c.owner.email if c.owner else None,
            "usage_count": c.usage_count,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in codes
    ]
