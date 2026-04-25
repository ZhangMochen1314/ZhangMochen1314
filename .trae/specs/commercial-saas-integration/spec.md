# DeerFlow 火山引擎集成与缺陷修复 Spec

## Why
目前项目（DeerFlow v2.5）存在严重的安全漏洞（如 API Key 泄露、JWT 弱密钥、危险的 Bash 执行权限）和架构缺陷（数据库并发能力差、上传无限制）。为了支持面向人文社科的 SaaS 商业化运作，必须修复这些基础问题，并全面集成火山引擎（Volcengine）的云服务（TOS 对象存储、veFaaS 云沙箱及 RDS/Redis 持久化方案），以获得国内低延迟访问和可靠的会话恢复能力。

## What Changes
1. **安全修复 (Phase 1)**:
   - 清除 `.env` 及测试文件中的硬编码 API Key，改用环境变量注入。
   - 强制校验 `JWT_SECRET_KEY` 和 `DATABASE_URL` 环境变量，移除弱默认值（`super-secret-key-for-dev` 及 SQLite）。
   - 在 `uploads.py` 增加 100MB 大小限制及文件扩展名白名单校验。
   - 在 `config.yaml` 中禁用 `allow_host_bash`。
2. **火山引擎基础集成 (Phase 2)**:
   - 抽象对象存储接口 `StorageProvider`，保留阿里云 OSS，新增基于火山引擎 SDK 的 `TOSProvider`。
   - 新增 `VolcengineSandboxBackend`，调用火山 veFaaS API 实现 Python 云沙箱隔离执行。
3. **会话持久化层 (Phase 3)**:
   - 引入 Redis（24h 缓存）、PostgreSQL（永久操作日志）和 TOS（大数据快照）三级存储策略。
   - 实现 `SessionManager` 管理会话的创建、读取、更新、快照和恢复。
   - 编写数据库迁移脚本，并集成至业务路由中。

## Impact
- Affected specs: 无历史依赖 Spec
- Affected code: `backend/app/auth/jwt_utils.py`, `backend/app/gateway/deps.py`, `backend/app/gateway/routers/uploads.py`, `config.yaml`, `backend/tests/test_deepseek*.py`, `backend/app/storage/`, `backend/packages/harness/deerflow/community/aio_sandbox/`

## ADDED Requirements
### Requirement: 强制安全配置
系统 SHALL 在启动时验证关键环境变量是否存在，拒绝使用不安全的默认值。

#### Scenario: 缺少环境变量启动
- **WHEN** 环境变量 `JWT_SECRET_KEY` 或 `DATABASE_URL` 未设置时启动后端服务
- **THEN** 系统立即抛出异常并停止启动，提示用户必须配置安全的生产密钥和数据库地址。

### Requirement: 抽象存储与 TOS 支持
系统 SHALL 提供统一的存储接口，并支持配置为火山引擎 TOS。

#### Scenario: 上传文件至 TOS
- **WHEN** `config.yaml` 配置为 `provider: tos`，用户上传数据文件
- **THEN** 系统调用 `TOSProvider` 的实现，将文件上传至火山引擎对象存储，并返回合法的访问 URL。

### Requirement: 会话持久化与恢复
系统 SHALL 支持跨会话保存用户的分析进度、变量和文件列表。

#### Scenario: 断线重连恢复进度
- **WHEN** 用户关闭浏览器并在 24 小时内重新进入分析项目
- **THEN** `SessionManager` 从 Redis/PostgreSQL 恢复该会话状态，重新绑定对应的沙箱实例，用户可继续之前的分析。

## MODIFIED Requirements
### Requirement: 文件上传安全限制
- 移除现有的无限制文件读取逻辑。
- 新增逻辑：上传接口必须先校验文件大小（≤ 100MB）和文件类型白名单，违规请求直接返回 400 错误。