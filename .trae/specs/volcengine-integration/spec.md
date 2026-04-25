# Volcengine Integration Spec

## Why
当前系统存在多个硬编码的安全漏洞（如DeepSeek API Key、JWT弱密钥等），且存储和沙箱功能强绑定了特定供应商或本地环境，不支持会话持久化。为了满足向火山引擎云环境的迁移以及生产环境（100个学生/天并发）的安全性与可用性要求，需要重构相关模块。

## What Changes
- 移除所有硬编码的API Key，强制通过环境变量读取。
- 移除默认的JWT `SECRET_KEY`，若未配置环境变量则拒绝启动系统。
- 强制校验 `DATABASE_URL`，移除SQLite默认降级。
- 增加上传文件大小（最大100MB）和白名单类型限制。
- 禁用 `allow_host_bash` 配置以防止宿主机命令注入风险。
- **BREAKING**: 重构存储模块为抽象的 `StorageProvider` 接口，新增 `TOSProvider` 以支持火山引擎对象存储。
- **BREAKING**: 重构沙箱后端，新增 `VolcengineSandboxBackend` 对接火山引擎veFaaS云沙箱。
- 新增 `SessionManager` 模块，结合 Redis（缓存热数据）、PostgreSQL（记录操作日志）和 TOS（持久化大文件快照）实现会话持久化机制。
- 更新 `config.yaml` 和 `.env.example` 配置文件。

## Impact
- Affected specs: 认证授权、文件上传、沙箱执行、会话恢复
- Affected code:
  - `backend/app/auth/jwt_utils.py`
  - `backend/app/gateway/deps.py`
  - `backend/app/gateway/routers/uploads.py`
  - `backend/app/storage/oss_provider.py`
  - `backend/packages/harness/deerflow/community/aio_sandbox/`
  - `config.yaml`及其他配置文件

## ADDED Requirements
### Requirement: 抽象存储接口与 TOS 支持
系统必须提供统一的存储接口，允许在 OSS 和 TOS 之间无缝切换。

#### Scenario: Success case
- **WHEN** 系统配置为 `provider: tos`
- **THEN** 系统使用 `TOSProvider` 上传文件至火山引擎 TOS，并返回有效的访问 URL。

### Requirement: 火山引擎云沙箱后端
系统必须能通过火山引擎 veFaaS 创建隔离的 Python 执行环境。

#### Scenario: Success case
- **WHEN** 用户请求分析数据
- **THEN** 系统调用 `VolcengineSandboxBackend` 分配云沙箱实例并安全执行 Python 代码。

### Requirement: 会话持久化
系统必须支持跨会话状态恢复，包括历史代码、上传文件和中间变量。

#### Scenario: Success case
- **WHEN** 用户重新连接至先前的分析会话
- **THEN** `SessionManager` 从 Redis/TOS 加载历史上下文并恢复沙箱状态。

## MODIFIED Requirements
### Requirement: 安全配置校验
必须彻底移除所有弱安全性的默认配置和硬编码密钥，确保启动时的严格校验。

## REMOVED Requirements
### Requirement: 默认 SQLite 支持
**Reason**: SQLite 不支持生产环境的高并发访问。
**Migration**: 强制使用 PostgreSQL 并配置 `DATABASE_URL`。