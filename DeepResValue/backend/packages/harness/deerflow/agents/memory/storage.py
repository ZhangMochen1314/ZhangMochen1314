"""Memory storage providers."""

import abc
import json
import logging
import threading
import uuid
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from deerflow.config.agents_config import AGENT_NAME_PATTERN
from deerflow.config.memory_config import get_memory_config
from deerflow.config.paths import get_paths

try:
    from app.database import SessionLocal
    from app.models import TenantConfig
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False

logger = logging.getLogger(__name__)


def utc_now_iso_z() -> str:
    """Current UTC time as ISO-8601 with ``Z`` suffix (matches prior naive-UTC output)."""
    return datetime.now(UTC).isoformat().removesuffix("+00:00") + "Z"


def create_empty_memory() -> dict[str, Any]:
    """Create an empty memory structure."""
    return {
        "version": "1.0",
        "lastUpdated": utc_now_iso_z(),
        "user": {
            "workContext": {"summary": "", "updatedAt": ""},
            "personalContext": {"summary": "", "updatedAt": ""},
            "topOfMind": {"summary": "", "updatedAt": ""},
        },
        "history": {
            "recentMonths": {"summary": "", "updatedAt": ""},
            "earlierContext": {"summary": "", "updatedAt": ""},
            "longTermBackground": {"summary": "", "updatedAt": ""},
        },
        "facts": [],
    }


class MemoryStorage(abc.ABC):
    """Abstract base class for memory storage providers."""

    @abc.abstractmethod
    def load(self, agent_name: str | None = None, tenant_id: int | None = None) -> dict[str, Any]:
        """Load memory data for the given agent/tenant."""
        pass

    @abc.abstractmethod
    def reload(self, agent_name: str | None = None, tenant_id: int | None = None) -> dict[str, Any]:
        """Force reload memory data for the given agent/tenant."""
        pass

    @abc.abstractmethod
    def save(self, memory_data: dict[str, Any], agent_name: str | None = None, tenant_id: int | None = None) -> bool:
        """Save memory data for the given agent/tenant."""
        pass


class DatabaseMemoryStorage(MemoryStorage):
    """Database-backed memory storage provider for SaaS multi-tenancy."""

    def __init__(self):
        self._memory_cache: dict[str | None, tuple[dict[str, Any], datetime | None]] = {}
        self._cache_lock = threading.Lock()

    def _load_from_db(self, tenant_id: int | None) -> dict[str, Any]:
        if not DB_AVAILABLE or tenant_id is None:
            return create_empty_memory()
            
        with SessionLocal() as db:
            config = db.query(TenantConfig).filter(TenantConfig.user_id == tenant_id).first()
            if config and config.memory_json:
                try:
                    return json.loads(config.memory_json)
                except json.JSONDecodeError:
                    return create_empty_memory()
        return create_empty_memory()

    def load(self, agent_name: str | None = None, tenant_id: int | None = None) -> dict[str, Any]:
        cache_key = f"{agent_name}:{tenant_id}"
        with self._cache_lock:
            if cache_key in self._memory_cache:
                return self._memory_cache[cache_key][0]
                
        data = self._load_from_db(tenant_id)
        with self._cache_lock:
            self._memory_cache[cache_key] = (data, datetime.now(UTC))
        return data

    def reload(self, agent_name: str | None = None, tenant_id: int | None = None) -> dict[str, Any]:
        data = self._load_from_db(tenant_id)
        cache_key = f"{agent_name}:{tenant_id}"
        with self._cache_lock:
            self._memory_cache[cache_key] = (data, datetime.now(UTC))
        return data

    def save(self, memory_data: dict[str, Any], agent_name: str | None = None, tenant_id: int | None = None) -> bool:
        if not DB_AVAILABLE or tenant_id is None:
            return False
            
        memory_data = {**memory_data, "lastUpdated": utc_now_iso_z()}
        cache_key = f"{agent_name}:{tenant_id}"
        
        with SessionLocal() as db:
            config = db.query(TenantConfig).filter(TenantConfig.user_id == tenant_id).first()
            if not config:
                config = TenantConfig(user_id=tenant_id, memory_json=json.dumps(memory_data, ensure_ascii=False))
                db.add(config)
            else:
                config.memory_json = json.dumps(memory_data, ensure_ascii=False)
            db.commit()
            
        with self._cache_lock:
            self._memory_cache[cache_key] = (memory_data, datetime.now(UTC))
        return True


# Internal singleton instance for the default file storage
_storage_instance: MemoryStorage | None = None
_storage_lock = threading.Lock()


def get_memory_storage() -> MemoryStorage:
    """Get the active memory storage provider.
    
    Loads the provider specified in the memory configuration. Falls back to
    DatabaseMemoryStorage if loading fails or none is configured.
    """
    global _storage_instance
    if _storage_instance is not None:
        return _storage_instance

    with _storage_lock:
        if _storage_instance is not None:
            return _storage_instance

        config = get_memory_config()
        storage_class_path = config.storage_class

        if not storage_class_path:
            _storage_instance = DatabaseMemoryStorage()
            return _storage_instance

        try:
            module_path, class_name = storage_class_path.rsplit(".", 1)
            import importlib

            module = importlib.import_module(module_path)
            storage_class = getattr(module, class_name)

            # Validate that the configured storage is a MemoryStorage implementation
            if not isinstance(storage_class, type):
                logger.error(
                    "Configured storage class %s is not a class, falling back to DatabaseMemoryStorage",
                    storage_class_path
                )
                _storage_instance = DatabaseMemoryStorage()
            elif not issubclass(storage_class, MemoryStorage):
                logger.error(
                    "Configured storage class %s does not inherit from MemoryStorage, falling back to DatabaseMemoryStorage",
                    storage_class_path
                )
                _storage_instance = DatabaseMemoryStorage()
            else:
                _storage_instance = storage_class()
        except Exception as e:
            logger.error(
                "Failed to load memory storage %s, falling back to DatabaseMemoryStorage: %s",
                storage_class_path,
                e,
            )
            _storage_instance = DatabaseMemoryStorage()

    return _storage_instance
