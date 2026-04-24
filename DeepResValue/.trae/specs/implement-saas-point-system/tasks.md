# Tasks

## Phase 1: 基础设施与用户认证模块
- [x] Task 1.1: 引入 ORM 框架（如 SQLAlchemy/SQLModel）并配置 PostgreSQL 连接池。
- [x] Task 1.2: 设计基础数据表结构：`users` (用户信息表)、`points_ledger` (积分账单表)、`user_sessions` (设备会话表)。
- [x] Task 1.3: 实现基于 JWT 的鉴权中间件，在 FastAPI 路由中全局配置。
- [x] Task 1.4: 提供注册、登录、找回密码、查询个人信息的 RESTful API。

## Phase 2: 多租户数据隔离改造
- [x] Task 2.1: 重构对话管理与历史记录路由，确保所有对 `threads` 和 `messages` 的访问强制校验 `user_id`。
- [x] Task 2.2: 废弃全局 `USER.md` 和 `memory.json` 文件存储机制，将其迁移为数据库中与租户绑定的配置表。
- [x] Task 2.3: 改造沙盒文件系统路径，确保文件挂载的宿主目录按照租户隔开，如 `/mnt/tenant_{user_id}/workspace`。

## Phase 3: 积分制与计费账单系统
- [x] Task 3.1: 定义大模型 Token 到 积分（Points） 的兑换汇率表（如 DeepSeek-V4-Pro 每 1k Token = 10 积分）。
- [x] Task 3.2: 开发 LLM 前置拦截器，当用户积分余额不足时阻止大模型请求，返回 `402 Payment Required`。
- [x] Task 3.3: 开发 LLM 后置回调处理器，提取大模型响应体中的 `usage` (Token 使用量)，计算消费并在 `points_ledger` 中异步扣除。
- [x] Task 3.4: 提供充值回调、积分流水明细查询的客户端 API。

## Phase 4: 安全与容器调度优化
- [x] Task 4.1: 升级 Docker Sandbox Provider，使 Sandbox 容器实例与具体的租户（Tenant）绑定，确保运行环境物理隔离。
- [x] Task 4.2: 增加针对单租户并发调用的速率限制（Rate Limiting），防止恶意消耗计算资源。

# Task Dependencies
- [Phase 2] depends on [Phase 1]
- [Phase 3] depends on [Phase 1]
- [Phase 4] depends on [Phase 2]
