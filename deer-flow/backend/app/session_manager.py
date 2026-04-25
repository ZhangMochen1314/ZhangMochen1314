import json
import time
import os
import tempfile
import asyncio
from dataclasses import dataclass, field
from typing import Dict, Any, Optional
import redis.asyncio as redis

from app.storage.provider import StorageProvider

@dataclass
class SessionState:
    session_id: str
    user_id: Optional[str] = None
    state: Dict[str, Any] = field(default_factory=dict)
    last_updated: float = field(default_factory=time.time)

    def to_json(self) -> str:
        return json.dumps({
            "session_id": self.session_id,
            "user_id": self.user_id,
            "state": self.state,
            "last_updated": self.last_updated
        })

    @classmethod
    def from_json(cls, data: str) -> 'SessionState':
        parsed = json.loads(data)
        return cls(**parsed)


class SessionManager:
    """
    Manages session state with active state in Redis and snapshots in TOS (or any StorageProvider).
    """
    def __init__(self, redis_client: redis.Redis, storage_provider: StorageProvider, ttl: int = 86400):
        self.redis = redis_client
        self.storage = storage_provider
        self.ttl = ttl  # Default 1 day TTL in Redis

    def _redis_key(self, session_id: str) -> str:
        return f"session:{session_id}"

    def _storage_key(self, session_id: str) -> str:
        return f"sessions/{session_id}.json"

    async def get_session(self, session_id: str) -> Optional[SessionState]:
        """
        Get session state. Tries Redis first (active), then falls back to TOS (snapshot).
        """
        key = self._redis_key(session_id)
        
        # 1. Try Redis
        try:
            data = await self.redis.get(key)
            if data:
                # Refresh TTL on access
                await self.redis.expire(key, self.ttl)
                if isinstance(data, bytes):
                    data = data.decode("utf-8")
                return SessionState.from_json(data)
        except Exception as e:
            # Log error but fallback to TOS
            print(f"Failed to read from Redis for session {session_id}: {e}")
            pass

        # 2. Try TOS Snapshot
        storage_key = self._storage_key(session_id)
        
        tmp_fd, tmp_path = tempfile.mkstemp()
        os.close(tmp_fd)
            
        try:
            await self.storage.download_file(storage_key, tmp_path)
            with open(tmp_path, "r", encoding="utf-8") as f:
                content = f.read()
            session_state = SessionState.from_json(content)
            
            # Restore to Redis
            try:
                await self.redis.setex(key, self.ttl, session_state.to_json())
            except Exception as e:
                print(f"Failed to restore session {session_id} to Redis: {e}")
                
            return session_state
        except Exception:
            # Session not found or error reading from TOS
            return None
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    async def save_session(self, session_state: SessionState) -> None:
        """
        Save active session state to Redis. 
        Note: This does not snapshot to TOS immediately for performance.
        """
        session_state.last_updated = time.time()
        key = self._redis_key(session_state.session_id)
        try:
            await self.redis.setex(key, self.ttl, session_state.to_json())
        except Exception as e:
            print(f"Failed to save session {session_state.session_id} to Redis: {e}")
            raise e

    async def snapshot_session(self, session_id: str) -> None:
        """
        Snapshot active session from Redis to TOS.
        Should be called periodically or when session reaches a checkpoint.
        """
        key = self._redis_key(session_id)
        try:
            data = await self.redis.get(key)
        except Exception as e:
            print(f"Failed to get session {session_id} from Redis for snapshot: {e}")
            return

        if not data:
            return  # No active session found
            
        if isinstance(data, bytes):
            data = data.decode("utf-8")

        storage_key = self._storage_key(session_id)
        
        tmp_fd, tmp_path = tempfile.mkstemp()
        try:
            with os.fdopen(tmp_fd, 'w', encoding="utf-8") as tmp:
                tmp.write(data)
                
            await self.storage.upload_file(storage_key, tmp_path)
        except Exception as e:
            print(f"Failed to snapshot session {session_id} to TOS: {e}")
            raise e
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    async def delete_session(self, session_id: str) -> None:
        """
        Delete session completely from both Redis and TOS.
        """
        key = self._redis_key(session_id)
        try:
            await self.redis.delete(key)
        except Exception as e:
            print(f"Failed to delete session {session_id} from Redis: {e}")

        storage_key = self._storage_key(session_id)
        try:
            await self.storage.delete_file(storage_key)
        except Exception as e:
            print(f"Failed to delete session {session_id} from TOS: {e}")
