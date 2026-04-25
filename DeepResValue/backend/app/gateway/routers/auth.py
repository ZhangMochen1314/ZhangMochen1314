from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import User, BetaInviteCode, InviteRecord, PointsLedger
from app.auth_utils import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    invite_code: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    invite_code: str | None = None

    class Config:
        from_attributes = True

import uuid

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Verify invite code
    invite_code_str = user.invite_code.strip()
    inviter = db.query(User).filter(User.invite_code == invite_code_str).first()
    beta_code = None
    if not inviter:
        beta_code = db.query(BetaInviteCode).filter(BetaInviteCode.code == invite_code_str).first()
        if not beta_code:
            raise HTTPException(status_code=400, detail="Invalid invite code")

    # 2. Check if user already exists
    db_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # 3. Create user
    hashed_password = get_password_hash(user.password)
    # Generate an exclusive invite code for the new user
    new_user_invite_code = str(uuid.uuid4())[:8].upper()
    # Award 50 points to new user
    new_user = User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password,
        points=50.0,
        invite_code=new_user_invite_code,
        invited_by_id=inviter.id if inviter else None
    )
    db.add(new_user)
    db.flush() # flush to get new_user.id

    # 4. Handle invite rewards and records
    if inviter:
        inviter.points += 100.0
        
        # Add ledger for inviter
        inviter_ledger = PointsLedger(
            user_id=inviter.id,
            transaction_type="invite_reward",
            amount=100.0,
            balance_after=inviter.points,
            description=f"Reward for inviting user {new_user.username}"
        )
        db.add(inviter_ledger)
        
        # Record invite
        invite_record = InviteRecord(
            code_used=invite_code_str,
            inviter_id=inviter.id,
            invitee_id=new_user.id,
            points_awarded_inviter=100.0,
            points_awarded_invitee=50.0
        )
        db.add(invite_record)
    elif beta_code:
        beta_code.usage_count += 1
        
        invite_record = InviteRecord(
            code_used=invite_code_str,
            inviter_id=None,
            invitee_id=new_user.id,
            points_awarded_inviter=0.0,
            points_awarded_invitee=50.0
        )
        db.add(invite_record)

    # Add ledger for new user (signup reward)
    new_user_ledger = PointsLedger(
        user_id=new_user.id,
        transaction_type="signup_reward",
        amount=50.0,
        balance_after=50.0,
        description="Reward for signing up with an invite code"
    )
    db.add(new_user_ledger)

    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# In order to implement `get_me`, we need to get current user from request state (set by middleware) or via Depends.
from fastapi import Request

@router.get("/me", response_model=UserResponse)
def get_me(request: Request, db: Session = Depends(get_db)):
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Placeholder for forgot password logic (e.g. sending email)
    return {"message": "If the email is registered, a password reset link will be sent."}

