import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.gateway.models import InviteCode, SystemConfig
from app.gateway.database import Base
import sys

engine = create_async_engine("sqlite+aiosqlite:///billing.db", echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def main():
    # Force recreate tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        # Create master beta code: "DEEPRESVALUE2026"
        beta_code = "DEEPRESVALUE2026"
        db.add(InviteCode(code=beta_code, owner_id=None))
        
        # Set default system configs
        db.add(SystemConfig(key="REGISTER_INITIAL_CREDITS", value="50", description="注册赠送点数"))
        db.add(SystemConfig(key="REFERRAL_REWARD_CREDITS", value="100", description="邀请新用户奖励点数"))
        
        await db.commit()
        print(f"✅ Success! Beta code '{beta_code}' created.")
        print(f"✅ System Configs initialized (Register: 50, Referral: 100).")

if __name__ == "__main__":
    asyncio.run(main())