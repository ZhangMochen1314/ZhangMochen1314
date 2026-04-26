import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.gateway.deps import get_current_user, get_db_session, get_current_admin_user

from .jwt_utils import create_access_token, get_password_hash, verify_password
from .models import User
from .schemas import UserCreate, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["auth"])
admin_router = APIRouter(prefix="/api/admin", tags=["admin"])

def generate_invite_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db_session)):
    # Validate invite code
    invite_code = user_data.invite_code.strip()
    HARDCODED_BETA_CODES = {"DEEP2026"}
    
    inviter = None
    if invite_code not in HARDCODED_BETA_CODES:
        inviter_result = await db.execute(select(User).where(User.my_invite_code == invite_code))
        inviter = inviter_result.scalars().first()
        if not inviter:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid invite code"
            )

    # Check if user exists
    result = await db.execute(select(User).where((User.username == user_data.username) | (User.email == user_data.email)))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Generate unique my_invite_code
    while True:
        my_invite_code = generate_invite_code()
        existing = await db.execute(select(User).where(User.my_invite_code == my_invite_code))
        if not existing.scalars().first():
            break
            
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        my_invite_code=my_invite_code,
        invited_by=invite_code,
        credits=150  # 100 base + 50 reward
    )
    db.add(new_user)
    
    if inviter:
        inviter.credits += 100
        db.add(inviter)
        
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

from pydantic import BaseModel

class AddCreditsRequest(BaseModel):
    user_id: int
    amount: int

@admin_router.get("/users")
async def get_all_users(admin_user: User = Depends(get_current_admin_user), db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return {"users": [{"id": u.id, "username": u.username, "email": u.email, "role": u.role, "credits": u.credits, "my_invite_code": u.my_invite_code, "created_at": u.created_at.isoformat() if u.created_at else None} for u in users]}

@admin_router.post("/add_credits")
async def add_credits(req: AddCreditsRequest, admin_user: User = Depends(get_current_admin_user), db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User).where(User.id == req.user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.credits += req.amount
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"message": "success", "new_credits": user.credits}
