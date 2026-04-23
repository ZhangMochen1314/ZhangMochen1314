import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
import yaml

# Load config to get DB URL
def get_db_url():
    config_path = os.environ.get("DEER_FLOW_CONFIG_PATH", "/app/config.yaml")
    if not os.path.exists(config_path):
        config_path = "/workspace/deer-flow/config.yaml" # Fallback for local testing
    
    try:
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)
            return config.get("database", {}).get("url", "sqlite+aiosqlite:///billing.db")
    except Exception:
        return "sqlite+aiosqlite:///billing.db"

SQLALCHEMY_DATABASE_URL = get_db_url()

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    future=True
)

AsyncSessionLocal = async_sessionmaker(
    engine, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session