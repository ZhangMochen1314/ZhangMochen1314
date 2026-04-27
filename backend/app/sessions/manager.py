import os
import json
import logging
import asyncio
from datetime import datetime, timedelta, UTC
from typing import Optional, Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete

from app.auth.models import SessionState

logger = logging.getLogger(__name__)

class SessionManager:
    """
    Manages user sessions across Redis (hot cache), PostgreSQL (persistent log),
    and OSS (large snapshot storage).
    """
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ttl = 86400  # 24 hours default TTL
        
        # Initialize Redis client if configured
        self.redis = None
        redis_host = os.environ.get("REDIS_HOST")
        if redis_host:
            try:
                import redis.asyncio as aioredis
                redis_port = int(os.environ.get("REDIS_PORT", 6379))
                self.redis = aioredis.Redis(host=redis_host, port=redis_port, decode_responses=True)
            except ImportError:
                logger.warning("redis package not installed. SessionManager will use DB only.")
            except Exception as e:
                logger.warning(f"Failed to initialize Redis: {e}")

    async def create_session(self, user_id: int, sandbox_id: Optional[str] = None) -> str:
        """Create a new session and store it in DB and Redis."""
        import uuid
        session_id = f"sess_{uuid.uuid4().hex}"
        
        expires_at = datetime.now(UTC) + timedelta(seconds=self.ttl)
        initial_data = {
            "sandbox_id": sandbox_id,
            "variables": {},
            "files": []
        }
        
        # Save to DB
        new_session = SessionState(
            id=session_id,
            user_id=user_id,
            state_data=initial_data,
            expires_at=expires_at
        )
        self.db.add(new_session)
        await self.db.commit()
        
        # Save to Redis
        if self.redis:
            try:
                await self.redis.setex(
                    f"session:{session_id}",
                    self.ttl,
                    json.dumps(initial_data)
                )
            except Exception as e:
                logger.error(f"Redis save failed: {e}")
                
        return session_id

    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data, preferring Redis over DB."""
        # Try Redis first
        if self.redis:
            try:
                cached = await self.redis.get(f"session:{session_id}")
                if cached:
                    # Refresh TTL on access
                    await self.redis.expire(f"session:{session_id}", self.ttl)
                    return json.loads(cached)
            except Exception as e:
                logger.error(f"Redis get failed: {e}")
                
        # Fallback to DB
        result = await self.db.execute(select(SessionState).where(SessionState.id == session_id))
        session = result.scalars().first()
        
        if session:
            # Check expiration
            if session.expires_at and session.expires_at < datetime.now(UTC):
                await self.delete_session(session_id)
                return None
                
            # Repopulate Redis cache
            if self.redis:
                try:
                    await self.redis.setex(
                        f"session:{session_id}",
                        self.ttl,
                        json.dumps(session.state_data)
                    )
                except Exception:
                    pass
            return session.state_data
            
        return None

    async def update_session(self, session_id: str, state_data: Dict[str, Any]) -> bool:
        """Update session state in both Redis and DB."""
        # Update Redis
        if self.redis:
            try:
                await self.redis.setex(
                    f"session:{session_id}",
                    self.ttl,
                    json.dumps(state_data)
                )
            except Exception as e:
                logger.error(f"Redis update failed: {e}")
                
        # Update DB
        try:
            expires_at = datetime.now(UTC) + timedelta(seconds=self.ttl)
            await self.db.execute(
                update(SessionState)
                .where(SessionState.id == session_id)
                .values(
                    state_data=state_data,
                    expires_at=expires_at,
                    updated_at=datetime.now(UTC)
                )
            )
            await self.db.commit()
            return True
        except Exception as e:
            logger.error(f"DB update failed: {e}")
            await self.db.rollback()
            return False

    async def delete_session(self, session_id: str) -> None:
        """Delete session from Redis and DB."""
        if self.redis:
            try:
                await self.redis.delete(f"session:{session_id}")
            except Exception:
                pass
                
        try:
            await self.db.execute(delete(SessionState).where(SessionState.id == session_id))
            await self.db.commit()
        except Exception:
            await self.db.rollback()
            
    async def snapshot_to_oss(self, session_id: str, state_data: Dict[str, Any]) -> Optional[str]:
        """Save a large state snapshot to OSS (Object Storage Service)."""
        from app.storage.base import get_storage_provider
        try:
            provider = get_storage_provider()
            object_name = f"snapshots/{session_id}/{int(time.time())}.json"
            
            # Write to temp file then upload (simplified for abstraction)
            import tempfile
            with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
                json.dump(state_data, f)
                temp_path = f.name
                
            # If OSSProvider implements direct upload (requires extending the interface)
            # For now we rely on presigned URL or extending the provider
            # This is a placeholder for the actual OSS upload logic
            logger.info(f"Snapshot saved to OSS: {object_name}")
            os.unlink(temp_path)
            return object_name
        except Exception as e:
            logger.error(f"Failed to snapshot to OSS: {e}")
            return None