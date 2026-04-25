# 改造数据库代码逻辑 (Database Decoupling) Spec

## Why
目前 `deer-flow` 的所有数据（包含用户凭证、充值等敏感数据以及对话流等应用数据）均存储在一个统一的云端数据库中。为了满足“将核心账号及计费数据保留在本地/自管数据库”的安全和合规需求，需要将系统的数据库连接逻辑进行解耦拆分，使得不同领域（Auth & Billing vs Application）的数据能够路由到不同的物理数据库。

## What Changes
- 在 `backend/app/gateway/deps.py` 中引入双数据库连接池（Engine），一个是 `engine`（默认应用库），另一个是 `auth_engine`（核心自管库）。
- 修改 `backend/app/auth/router.py` 和 `backend/app/billing/router.py` 中的依赖项，将原本使用 `get_db_session` 的地方替换为专门的 `get_auth_db`。
- 修改 `backend/.env.example` 和 `backend/app/gateway/app.py` 的启动逻辑，使其能够根据环境变量 `AUTH_DATABASE_URL` 分别初始化两个数据库的数据表。

## Impact
- Affected specs: 数据库连接与依赖注入、启动建表脚本。
- Affected code: `backend/app/gateway/deps.py`, `backend/app/gateway/app.py`, `backend/app/auth/router.py`, `backend/app/billing/router.py`, `backend/.env.example`.

## ADDED Requirements
### Requirement: 核心数据库连接依赖
系统必须提供独立的 `get_auth_db` 依赖注入生成器，供鉴权和计费模块调用。

#### Scenario: 用户登录查询
- **WHEN** 用户请求 `/api/auth/login` 接口
- **THEN** 系统应通过 `get_auth_db` 建立与 `AUTH_DATABASE_URL` 的连接，并在该自管数据库中进行密码比对。

## MODIFIED Requirements
### Requirement: 数据库自动迁移与建表
原有的 `Base.metadata.create_all(bind=engine)` 逻辑必须更新，以确保 Auth 和 Billing 的模型能在 `auth_engine` 上建表，而其他的模型能在 `engine` 上建表（或者直接在两个库都执行建表，但业务上隔离使用）。

## REMOVED Requirements
### Requirement: 单一 `get_db_session`
**Reason**: 无法满足跨物理库的数据解耦需求。
**Migration**: 所有 `app/auth` 和 `app/billing` 下的数据库交互必须显式切换为 `get_auth_db`。