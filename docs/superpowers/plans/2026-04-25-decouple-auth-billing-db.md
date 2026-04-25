# 分离核心用户与计费数据至本地自管数据库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将系统中的核心敏感数据（用户的登录账号、密码哈希、充值金额、订阅状态等 Auth & Billing 数据）从云服务器分离，存储在用户本地或自建的加密数据库中；同时让对话历史、上传文件等重吞吐的数据继续留在云服务器。

**Architecture:** 
1. **数据库解耦 (Database Decoupling):** 将原本后端的单数据源（Single Database）拆分为“核心数据源 (Auth/Billing DB)”和“应用数据源 (App/Checkpointer DB)”。
2. **连接隧道 (Secure Tunnel):** 通过配置 Tailscale 或 WireGuard 建立云服务器与本地内网的安全隧道。云端 FastAPI 应用通过隧道 IP 连接到本地的 PostgreSQL/MySQL 实例。
3. **ORM 路由 (SQLAlchemy Binds):** 修改 FastAPI 的 SQLAlchemy 设置，使用 `binds` 机制。将 `app.auth.models` 和 `app.billing.models` 的查询路由到本地数据库（`AUTH_DATABASE_URL`），而其余模型保持在云端（`DATABASE_URL`）。

**Tech Stack:** FastAPI, SQLAlchemy (Binds), PostgreSQL/MySQL, Tailscale/WireGuard

---

### Task 1: 配置 SQLAlchemy 多数据库路由 (Multiple Binds)

**Files:**
- Modify: `backend/app/gateway/deps.py`
- Modify: `backend/app/auth/models.py`
- Modify: `backend/app/billing/models.py`
- Modify: `backend/.env.example`

- [ ] **Step 1: 增加核心数据源环境变量配置**
修改 `.env.example`，新增 `AUTH_DATABASE_URL`。
```env
# 云端应用数据库 (用于其它非敏感状态)
DATABASE_URL=sqlite+aiosqlite:///./deerflow.db

# 本地/自管核心数据库 (用于 Auth & Billing)
AUTH_DATABASE_URL=postgresql+asyncpg://user:password@100.x.x.x:5432/core_db
```

- [ ] **Step 2: 修改 `deps.py` 以支持 SQLAlchemy Binds**
在 `backend/app/gateway/deps.py` 中，重构 `engine` 和 `async_session_maker`，引入 `AUTH_DATABASE_URL`。
```python
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./deerflow.db")
AUTH_DATABASE_URL = os.getenv("AUTH_DATABASE_URL", DATABASE_URL)

engine = create_async_engine(DATABASE_URL, echo=False)
auth_engine = create_async_engine(AUTH_DATABASE_URL, echo=False)

# 在后续代码中，我们将在具体查询时根据模型选择对应的 engine
# 这是一个简化的架构思路，更健壮的做法是在 SessionMaker 中配置 binds
async_session_maker = async_sessionmaker(
    engine, expire_on_commit=False, binds={
        # 这里需要将 auth 和 billing 的 Base 元数据绑定到 auth_engine
    }
)
```

- [ ] **Step 3: 为 Auth 和 Billing 模型指定独立的 MetaData (或直接在 Base 中处理)**
为了让 SQLAlchemy 知道哪些表去哪个库，需要将 Auth 和 Billing 模型绑定到一个特定的 `info={'bind_key': 'auth'}`。
修改 `backend/app/auth/models.py` 和 `backend/app/billing/models.py` 的模型：
```python
# app/auth/models.py
class User(Base):
    __tablename__ = "users"
    __table_args__ = {'info': {'bind_key': 'auth'}}
    # ... fields ...
```

- [ ] **Step 4: 完善 Binds 配置**
在 `deps.py` 中：
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.auth.models import Base as AuthBase  # 假设它们共享同一个 Base，则绑定整个 Base 或指定表

# 假设所有表共享同一个 Base
binds = {}
if AUTH_DATABASE_URL != DATABASE_URL:
    auth_engine = create_async_engine(AUTH_DATABASE_URL, echo=False)
    # 通过 bind_key 将请求路由到本地数据库
    # 此处需在 SQLAlchemy 中注册 bind
```

*(由于当前代码库使用的是单一的 `Base`，具体的 SQLAlchemy 2.0 Binds 实现可能需要创建一个自定义的 `RoutingSession`。为保持最简，Task 1 的核心是**将 User 和 Billing 相关的读写逻辑分离出独立的 Session**)*

### Task 2: 重构数据库连接与依赖注入

**Files:**
- Modify: `backend/app/gateway/deps.py`
- Modify: `backend/app/auth/router.py`

- [ ] **Step 1: 提供独立的 `get_auth_db` 依赖**
在 `deps.py` 中：
```python
auth_engine = create_async_engine(os.getenv("AUTH_DATABASE_URL", DATABASE_URL), echo=False)
auth_session_maker = async_sessionmaker(auth_engine, expire_on_commit=False)

async def get_auth_db():
    async with auth_session_maker() as session:
        yield session
```

- [ ] **Step 2: 修改 Auth/Billing 路由使用新的 DB 依赖**
在 `backend/app/auth/router.py` 和 `backend/app/billing/router.py` 中：
```python
from app.gateway.deps import get_auth_db

@router.post("/login")
async def login(db: AsyncSession = Depends(get_auth_db), ...):
    # 使用连接到本地数据库的 db session 进行认证
    pass
```

- [ ] **Step 3: 运行初始化迁移或建表脚本**
确保应用启动时，或者执行 `create_all` 时，分别在两个 Engine 上创建对应的表。

### Task 3: 建立云端到本地的安全网络隧道 (基础设施部署建议，非代码修改)

**Files:**
- Create: `docs/infrastructure/secure_tunnel_setup.md`

- [ ] **Step 1: 编写隧道配置文档**
提供一份 Markdown 文档，指导用户如何：
1. 在家里的电脑/NAS 上安装 PostgreSQL 并设置密码。
2. 在家里电脑和阿里云服务器上均安装 Tailscale (或 ZeroTier)。
3. 获取家里电脑的虚拟内网 IP (例如 `100.64.x.x`)。
4. 将该 IP 填入云服务器的 `.env` 中的 `AUTH_DATABASE_URL`。

```markdown
# 核心数据库本地隔离指南
1. 安装 Tailscale: `curl -fsSL https://tailscale.com/install.sh | sh`
2. 启动并登录: `sudo tailscale up`
3. 确保本地数据库允许该网段访问 (pg_hba.conf)
```
