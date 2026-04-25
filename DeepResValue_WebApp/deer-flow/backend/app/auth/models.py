from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    credits = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user")
    tier = Column(String, default="free")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    
    # Session relationship
    sessions = relationship("SessionState", back_populates="user", cascade="all, delete-orphan")

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
