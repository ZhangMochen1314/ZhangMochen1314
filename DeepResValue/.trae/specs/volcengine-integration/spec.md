# 火山引擎云服务集成与安全修复 Spec

## Why
DeerFlow v2.5 作为面向人文社科科研数据分析的 SaaS 产品，需要满足国内低延迟访问、用户会话持久化以及系统的生产级安全性。为了达成这一目标，必须修复当前已知的高危安全漏洞（如 API Key 泄露、弱密码默认值、无限制的文件上传），并全面集成火山引擎（Volcengine）的云沙箱（veFaaS）、对象存储（TOS）以及云数据库。

## What Changes
- **安全加固**：**BREAKING** 移除代码中的硬编码 API Key；强制校验 `JWT_SECRET_KEY` 和 `DATABASE_URL`；增加文件上传大小（100MB）与类型白名单限制；在配置中禁用 `allow_host_bash`。
- **存储接口抽象与 TOS 集成**：抽象出 `StorageProvider` 接口，保留现有阿里云 OSS 的支持，新增火山引擎对象存储 `TOSProvider` 实现。
- **沙箱接口抽象与 veFaaS 集成**：抽象出 `SandboxBackend` 接口，新增火山引擎云沙箱 `VolcengineSandboxBackend`，用于在云端安全执行 Python 数据分析代码。
- **会话持久化架构**：新增 `SessionManager` 模块，利用 Redis（会话热数据）、PostgreSQL（操作日志元数据）和 TOS（数据快照）三层存储架构实现跨会话的分析进度保存与恢复。
- **配置与可用性优化**：添加沙箱获取的 30 秒超时控制；支持预签名 URL 过期时间配置化；增加对 `.sas7bdat` (SAS 格式) 文件的解析支持。

## Impact
- Affected specs: 存储模块 (`StorageProvider`)、沙箱执行模块 (`SandboxBackend`)、API 网关（文件上传与认证中间件）、全局配置文件结构。
- Affected code:
  - `backend/app/auth_utils.py` 或 `jwt_utils.py` (JWT 鉴权逻辑)
  - `backend/app/gateway/deps.py` (数据库依赖注入)
  - `backend/app/gateway/routers/uploads.py` (上传路由)
  - `backend/app/storage/oss_provider.py` -> `storage_provider.py`
  - `backend/packages/harness/deerflow/community/aio_sandbox/` (沙箱后端实现)
  - `.env` 模板文件与 `config.yaml`
  - 新增的 `SessionManager` 及相关数据模型文件。

## ADDED Requirements
### Requirement: 抽象存储与火山引擎 TOS 集成
系统必须定义统一的 `StorageProvider` 接口，并提供基于火山引擎的 `TOSProvider` 实现。
#### Scenario: 上传科研数据到火山引擎
- **WHEN** 用户通过前端上传文件且系统配置为 `tos`
- **THEN** 文件被安全直传或服务端上传至火山引擎 TOS，并返回带有可配置过期时间的预签名访问 URL。

### Requirement: 火山引擎云沙箱执行
系统必须支持通过 `VolcengineSandboxBackend` 调用火山引擎 veFaaS 执行代码。
#### Scenario: 执行数据分析脚本
- **WHEN** 智能体生成并请求运行一段 Python 分析脚本
- **THEN** 系统通过火山引擎 API 动态分配云沙箱，在安全隔离环境中执行代码并返回标准输出结果。

### Requirement: 会话持久化与恢复
系统必须支持跨会话的状态保存与恢复。
#### Scenario: 用户中断后继续分析
- **WHEN** 用户在 24 小时内重新连接并请求恢复历史分析会话
- **THEN** 系统从 Redis/PostgreSQL/TOS 恢复先前的变量环境、执行历史和数据快照，允许无缝继续对话和代码执行。

## MODIFIED Requirements
### Requirement: 文件上传安全性限制
系统必须限制上传文件的大小与扩展名。
#### Scenario: 上传超大或非法文件
- **WHEN** 用户尝试上传超过 100MB 的文件或非白名单类型（如 `.exe`）
- **THEN** 系统在读取文件流前立即拦截并拒绝请求，返回 HTTP 400/413 错误。

### Requirement: 核心环境变量强校验
系统启动时必须拥有安全的运行环境，不允许使用不安全的默认值。
#### Scenario: 缺失关键环境变量
- **WHEN** 环境变量 `JWT_SECRET_KEY` 或 `DATABASE_URL` 未配置，或使用弱口令默认值（如 `super-secret-key-for-dev` 或 `sqlite`）
- **THEN** 应用程序拒绝启动，并在日志中抛出明确的配置缺失异常。

## REMOVED Requirements
### Requirement: 宿主机 Bash 执行
**Reason**: `allow_host_bash: true` 允许任意代码执行，存在极高的安全风险，不适合多租户 SaaS 环境。
**Migration**: 在 `config.yaml` 中强制设为 `false`，所有系统命令或代码执行必须路由到云端隔离沙箱中进行。