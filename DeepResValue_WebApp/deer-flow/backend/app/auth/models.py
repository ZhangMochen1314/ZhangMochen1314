from datetime import UTC, datetime
import string
import random

from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_invite_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    credits = Column(Integer, default=50)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user")
    tier = Column(String, default="free")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    
    invite_code = Column(String, unique=True, index=True, default=generate_invite_code)
    
    # Session relationship
    sessions = relationship("SessionState", back_populates="user", cascade="all, delete-orphan")

class InviteRecord(Base):
    __tablename__ = "invite_records"
    id = Column(Integer, primary_key=True, index=True)
    inviter_id = Column(Integer, ForeignKey("users.id"), nullable=True) # null if system invite
    invitee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    code_used = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

class SystemInvite(Base):
    __tablename__ = "system_invites"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    created_by = Column(String, nullable=False, default="admin")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

class SessionState(Base):
    __tablename__ = "session_states"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Store JSON representation of variables, file list, code history, etc.
    state_data = Column(JSON, nullable=False, default=dict) 
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    expires_at = Column(DateTime(timezone=True), nullable=True, index=True)

    user = relationship("User", back_populates="sessions")
