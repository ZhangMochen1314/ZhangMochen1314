import os
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
import jwt

from app.gateway.database import get_db
from app.gateway.models import User, InviteCode, BillingLog

router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "deepresvalue_super_secret_key_12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    invite_code: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    credits: int

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # 1. Check if email exists
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # 2. Check invite code
    result = await db.execute(select(InviteCode).where(InviteCode.code == request.invite_code).with_for_update())
    invite = result.scalars().first()
    if not invite:
        raise HTTPException(status_code=400, detail="Invalid invite code")
    if invite.is_used:
        raise HTTPException(status_code=400, detail="Invite code already used")
        
    # 3. Create User
    new_user = User(
        email=request.email,
        hashed_password=get_password_hash(request.password),
        credits=invite.initial_credits
    )
    db.add(new_user)
    await db.flush() # Get user.id
    
    # 4. Mark invite code as used
    invite.is_used = True
    invite.used_by_id = new_user.id
    
    # 5. Add billing log for initial credits
    log = BillingLog(
        user_id=new_user.id,
        action="invite_code_registration",
        credits_change=invite.initial_credits
    )
    db.add(log)
    
    await db.commit()
    
    # 6. Generate token
    access_token = create_access_token(
        data={"sub": new_user.email, "id": new_user.id, "role": new_user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user_id=new_user.id,
        email=new_user.email,
        credits=new_user.credits
    )

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        email=user.email,
        credits=user.credits
    )
