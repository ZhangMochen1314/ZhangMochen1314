import os
import random
import string
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
import jwt

from app.gateway.database import get_db
from app.gateway.models import User, InviteCode, BillingLog, SystemConfig

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
    my_invite_code: str | None = None

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

def generate_random_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

async def get_system_config(db: AsyncSession, key: str, default_value: str) -> str:
    result = await db.execute(select(SystemConfig).where(SystemConfig.key == key))
    config = result.scalars().first()
    if config:
        return config.value
    return default_value

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
        
    # Get system configs for registration and referral bonuses
    # Default: 50 for registration, 100 for referring a new user
    initial_credits = int(await get_system_config(db, "REGISTER_INITIAL_CREDITS", "50"))
    referral_reward = int(await get_system_config(db, "REFERRAL_REWARD_CREDITS", "100"))
        
    # 3. Create User
    new_user = User(
        email=request.email,
        hashed_password=get_password_hash(request.password),
        credits=initial_credits
    )
    db.add(new_user)
    await db.flush() # Get new_user.id
    
    # 4. Generate personal invite code for the new user
    personal_code = generate_random_code()
    new_invite = InviteCode(
        code=personal_code,
        owner_id=new_user.id
    )
    db.add(new_invite)
    
    # 5. Update used invite code & reward owner
    invite.usage_count += 1
    if invite.owner_id:
        # Give reward to the user who shared the code
        result_owner = await db.execute(select(User).where(User.id == invite.owner_id).with_for_update())
        owner = result_owner.scalars().first()
        if owner:
            owner.credits += referral_reward
            # Log reward
            db.add(BillingLog(
                user_id=owner.id,
                action="referral_reward",
                credits_change=referral_reward
            ))
            
    # 6. Add billing log for new user initial credits
    db.add(BillingLog(
        user_id=new_user.id,
        action="registration_bonus",
        credits_change=initial_credits
    ))
    
    await db.commit()
    
    # 7. Generate token
    access_token = create_access_token(
        data={"sub": new_user.email, "id": new_user.id, "role": new_user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user_id=new_user.id,
        email=new_user.email,
        credits=new_user.credits,
        my_invite_code=personal_code
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
        
    # Get user's personal invite code
    result_code = await db.execute(select(InviteCode).where(InviteCode.owner_id == user.id))
    personal_code_obj = result_code.scalars().first()
    my_invite_code = personal_code_obj.code if personal_code_obj else None
        
    access_token = create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        email=user.email,
        credits=user.credits,
        my_invite_code=my_invite_code
    )