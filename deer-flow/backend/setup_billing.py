import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.gateway.models import InviteCode, SystemConfig, SkillPricing, PointPackage
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
        
        # Initialize default skill prices
        skills = [
            ("LIT_SEARCH", "专业文献检索", 20),
            ("DeepResValue-Literature-Search", "自动文献综述", 50),
            ("DeepResValue-DataCollector", "数据提取与分析", 10),
            ("DeepResValue-DataClean", "微观企业指标提取", 50),
            ("DeepResValue-StatModel", "计量模型诊断与建议", 30),
            ("DeepResValue-DID", "复杂模型运算", 50),
            ("DeepResValue-SciPlot", "出版级图表生成", 20),
            ("DeepResValue-Spatial", "空间计量经济学分析", 80),
        ]
        for skill_id, name, cost in skills:
            db.add(SkillPricing(skill_id=skill_id, display_name=name, cost=cost))

        # Initialize default point packages
        packages = [
            ("基础包", 500, "¥29", False),
            ("科研包", 2000, "¥99", True),
            ("课题组包", 10000, "¥399", False),
        ]
        for name, points, price, is_rec in packages:
            db.add(PointPackage(name=name, points=points, price=price, is_recommended=is_rec))

        await db.commit()
        print(f"✅ Success! Beta code '{beta_code}' created.")
        print(f"✅ System Configs initialized (Register: 50, Referral: 100).")

if __name__ == "__main__":
    asyncio.run(main())