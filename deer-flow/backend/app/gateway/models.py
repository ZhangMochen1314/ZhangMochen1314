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
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    billing_logs = relationship("BillingLog", back_populates="user")
    used_invite = relationship("InviteCode", back_populates="used_by_user", uselist=False)

class InviteCode(Base):
    __tablename__ = "invite_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    initial_credits = Column(Integer, default=50, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    used_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    used_by_user = relationship("User", back_populates="used_invite")

class BillingLog(Base):
    __tablename__ = "billing_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False) # e.g. "recharge", "DeepResValue-Spatial"
    credits_change = Column(Integer, nullable=False) # Negative for deduction, positive for recharge
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="billing_logs")

class SkillPricing(Base):
    __tablename__ = "skill_pricing"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(String(100), unique=True, index=True, nullable=False)
    cost = Column(Integer, default=1, nullable=False)
