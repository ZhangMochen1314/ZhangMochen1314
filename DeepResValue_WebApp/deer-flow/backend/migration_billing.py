import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.auth.models import Base
import app.billing.models
import os

async def main():
    # Database URL
    db_path = os.path.join(os.path.dirname(__file__), "deerflow.db")
    db_url = f"sqlite+aiosqlite:///{db_path}"
    
    engine = create_async_engine(db_url, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    print("Migration successful: created billing tables (subscriptions, transactions, orders).")

if __name__ == "__main__":
    asyncio.run(main())
