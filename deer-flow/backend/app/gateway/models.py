from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    credits = Column(Integer, default=0, nullable=False)
    role = Column(String(50), default="user", nullable=False) # 'admin' or 'user'
    registered_with_code = Column(String(50), nullable=True) # the invite code used to register
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    billing_logs = relationship("BillingLog", back_populates="user")
    owned_invite_codes = relationship("InviteCode", back_populates="owner")

class InviteCode(Base):
    __tablename__ = "invite_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True) # None means it's an admin/beta code
    usage_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    owner = relationship("User", back_populates="owned_invite_codes")

class BillingLog(Base):
    __tablename__ = "billing_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False) # e.g. "registration_bonus", "referral_reward", "DeepResValue-Spatial"
    credits_change = Column(Integer, nullable=False) # Negative for deduction, positive for recharge
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="billing_logs")

class SkillPricing(Base):
    __tablename__ = "skill_pricing"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(String(100), unique=True, index=True, nullable=False)
    cost = Column(Integer, default=1, nullable=False)

class SystemConfig(Base):
    __tablename__ = "system_configs"

    key = Column(String(100), primary_key=True, index=True)
    value = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
