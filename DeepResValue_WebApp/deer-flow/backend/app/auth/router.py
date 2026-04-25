from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.gateway.deps import get_current_admin_user, get_current_user, get_db_session

from .jwt_utils import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_password_hash, verify_password
from .models import InviteRecord, SystemInvite, User

router = APIRouter(prefix="/auth", tags=["auth"])
admin_router = APIRouter(prefix="/api/admin", tags=["admin"])

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    invite_code: str



class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    credits: int
    is_active: bool
    role: str
    tier: str
    invite_code: str | None = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db_session)):
    # Validate Invite Code
    inviter = await db.execute(select(User).where(User.invite_code == user_data.invite_code))
    inviter = inviter.scalar_one_or_none()
    
    system_invite = None
    if not inviter:
        system_invite = await db.execute(select(SystemInvite).where(SystemInvite.code == user_data.invite_code))
        system_invite = system_invite.scalar_one_or_none()
        
    if not inviter and not system_invite:
        raise HTTPException(status_code=400, detail="Invalid invite code")

    # Check if user exists
    result = await db.execute(select(User).where((User.username == user_data.username) | (User.email == user_data.email)))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        credits=50
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Reward inviter if applicable
    if inviter:
        inviter.credits += 100
        db.add(inviter)
    
    # Record usage
    record = InviteRecord(
        inviter_id=inviter.id if inviter else None,
        invitee_id=new_user.id,
        code_used=user_data.invite_code
    )
    db.add(record)
    await db.commit()
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

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

@admin_router.get("/users")
async def get_all_users(admin_user: User = Depends(get_current_admin_user), db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return {"users": [{"id": u.id, "username": u.username, "role": u.role, "tier": u.tier} for u in users]}
