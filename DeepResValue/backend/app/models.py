from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    points = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    invite_code = Column(String, unique=True, index=True, nullable=True)
    invited_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    sessions = relationship("UserSession", back_populates="user")
    ledgers = relationship("PointsLedger", back_populates="user")
    invites_made = relationship("InviteRecord", foreign_keys="[InviteRecord.inviter_id]", back_populates="inviter")
    invite_received = relationship("InviteRecord", foreign_keys="[InviteRecord.invitee_id]", back_populates="invitee", uselist=False)

class BetaInviteCode(Base):
    __tablename__ = "beta_invite_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InviteRecord(Base):
    __tablename__ = "invite_records"

    id = Column(Integer, primary_key=True, index=True)
    code_used = Column(String, nullable=False)
    inviter_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Null if it was a beta code
    invitee_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    points_awarded_inviter = Column(Float, default=100.0)
    points_awarded_invitee = Column(Float, default=50.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    inviter = relationship("User", foreign_keys=[inviter_id], back_populates="invites_made")
    invitee = relationship("User", foreign_keys=[invitee_id], back_populates="invite_received")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_token = Column(String, unique=True, index=True, nullable=False)
    device_info = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="sessions")

class PointsLedger(Base):
    __tablename__ = "points_ledger"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transaction_type = Column(String, nullable=False) # e.g. "recharge", "consume"
    amount = Column(Float, nullable=False) # positive for recharge, negative for consume
    balance_after = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="ledgers")


class TenantConfig(Base):
    __tablename__ = "tenant_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    user_md = Column(String, default="")
    memory_json = Column(String, default="{}")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="config")

class AgentSession(Base):
    __tablename__ = "agent_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sandbox_id = Column(String, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_active_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    metadata_json = Column(JSON, default={})
    
    user = relationship("User", backref="agent_sessions")

class SessionOperationLog(Base):
    __tablename__ = "session_operation_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("agent_sessions.id"), nullable=False)
    operation_type = Column(String, nullable=False)
    details = Column(JSON, default={})
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("AgentSession", backref="operation_logs")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    points = Column(Float, nullable=False)
    status = Column(String, default="pending") # pending, paid, failed
    payment_method = Column(String, default="alipay")
    alipay_trade_no = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    paid_at = Column(DateTime, nullable=True)

    user = relationship("User", backref="orders")

class UserFeedback(Base):
    __tablename__ = "user_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    type = Column(String, default="bug") # bug, suggestion, other
    status = Column(String, default="pending") # pending, resolved
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="feedbacks")
