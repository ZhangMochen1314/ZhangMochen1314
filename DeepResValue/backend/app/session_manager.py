import json
import os
import redis.asyncio as redis
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from .models import AgentSession, SessionOperationLog
from .session_state import SessionState
from .storage import get_storage_provider

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
REDIS_TTL = 24 * 3600  # 24 hours

class SessionManager:
    def __init__(self):
        self.redis_client = redis.from_url(REDIS_URL, decode_responses=True)

    async def get_session(self, session_id: str, db: Session) -> Optional[SessionState]:
        """
        Get the session from Redis. If not in Redis, try fetching from PostgreSQL
        and TOS (for full state snapshot if applicable).
        """
        # Try Redis first
        state_json = await self.redis_client.get(f"session:{session_id}")
        if state_json:
            state_dict = json.loads(state_json)
            return SessionState(**state_dict)

        # Try PostgreSQL
        db_session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
        if db_session:
            state_dict = db_session.metadata_json
            state = SessionState(**state_dict)
            
            # Put it back to Redis
            await self._cache_to_redis(state)
            return state

        return None

    async def _cache_to_redis(self, state: SessionState):
        await self.redis_client.setex(
            f"session:{state.session_id}",
            REDIS_TTL,
            state.model_dump_json()
        )

    async def save_session(self, state: SessionState, db: Session):
        """
        Save active state to Redis and sync metadata to PostgreSQL.
        """
        state.update_activity()
        
        # Save to Redis
        await self._cache_to_redis(state)
        
        # Save to PostgreSQL
        db_session = db.query(AgentSession).filter(AgentSession.id == state.session_id).first()
        if not db_session:
            db_session = AgentSession(
                id=state.session_id,
                user_id=state.user_id,
                sandbox_id=state.sandbox_id,
                status=state.status,
                created_at=datetime.now(timezone.utc),
                last_active_at=state.last_active_at,
                metadata_json=state.model_dump()
            )
            db.add(db_session)
        else:
            db_session.last_active_at = state.last_active_at
            db_session.metadata_json = state.model_dump()
            db_session.status = state.status
            db_session.sandbox_id = state.sandbox_id
            
        db.commit()

    async def log_operation(self, session_id: str, operation_type: str, details: Dict[str, Any], db: Session):
        """
        Log an operation to PostgreSQL.
        """
        log = SessionOperationLog(
            session_id=session_id,
            operation_type=operation_type,
            details=details,
            created_at=datetime.now(timezone.utc)
        )
        db.add(log)
        db.commit()

    async def get_operation_logs(self, session_id: str, db: Session, limit: int = 50) -> List[SessionOperationLog]:
        """
        Get recent operation logs for a session from PostgreSQL.
        """
        return db.query(SessionOperationLog).filter(
            SessionOperationLog.session_id == session_id
        ).order_by(SessionOperationLog.created_at.desc()).limit(limit).all()

    async def save_snapshot(self, session_id: str, file_path: str, db: Session) -> str:
        """
        Save a large dataset snapshot to TOS/OSS.
        """
        provider = get_storage_provider()
        object_name = f"sessions/{session_id}/snapshots/{os.path.basename(file_path)}"
        url = await provider.upload_file(file_path, object_name)
        
        # Log the snapshot
        await self.log_operation(session_id, "snapshot_saved", {"url": url, "object_name": object_name}, db)
        
        return url

    async def load_snapshot(self, session_id: str, object_name: str, dest_path: str):
        """
        Download a snapshot from TOS/OSS.
        """
        provider = get_storage_provider()
        await provider.download_file(object_name, dest_path)

# Global SessionManager instance
session_manager = SessionManager()

def get_session_manager() -> SessionManager:
    return session_manager
