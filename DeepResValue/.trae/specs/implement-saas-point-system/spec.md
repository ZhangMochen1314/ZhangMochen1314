# SaaS 积分制多租户架构重构 Spec

## Why
当前 DeerFlow 系统是一个典型的单用户本地智能体开发框架，数据（如对话、记忆、偏好）以纯文件形式存储在本地宿主机上，没有任何用户认证与隔离机制。为了将其商业化为 SaaS 产品并采用积分制（Point-based System）进行计费，必须对系统架构进行彻底的多租户重构，建立用户隔离模型，并引入基于 Token 消耗的积分账单模块。

## What Changes
- **引入用户认证系统**：集成 JWT/OAuth2 机制，增加用户注册、登录、鉴权 API。
- **多租户数据存储**：**BREAKING** 废弃原有的单点文件存储（如全局的 `USER.md`、`memory.json`），引入 PostgreSQL 关系型数据库来管理多用户的会话、配置和记忆。
- **沙盒与文件系统隔离**：为每个用户建立独立的隔离工作区（Workspace）和沙盒实例映射，防止数据越权。
- **积分制计费账本**：在 LLM 请求中间件中拦截并统计输入/输出 Token 消耗，根据预设费率实时扣减对应账户的积分余额。

## Impact
- Affected specs: 用户认证体系、文件上传与访问权限、大模型计费中间件、沙盒容器调度。
- Affected code: 
  - `backend/app/gateway` 下的所有 API 路由（均需补充鉴权依赖）。
  - `backend/packages/harness/deerflow/memory` 的读写适配器。
  - `backend/packages/harness/deerflow/sandbox` 沙盒挂载路径逻辑。

## ADDED Requirements
### Requirement: 用户认证与鉴权
系统必须提供基于 JWT 的状态无关鉴权机制，保护所有数据访问。
#### Scenario: 拦截未授权访问
- **WHEN** 客户端未携带有效的 Bearer Token 访问对话 API 时
- **THEN** 网关拦截请求，返回 401 Unauthorized。

### Requirement: 多租户物理与逻辑隔离
系统必须保证每个租户只能访问属于自己的记忆、对话与沙盒文件。
#### Scenario: 跨租户越权读取
- **WHEN** 租户 A 尝试携带自己的 Token，使用租户 B 的 Thread ID 请求历史记录时
- **THEN** 后端数据库查询匹配失败，返回 403 Forbidden 或 404 Not Found。

### Requirement: 基于大模型消耗的积分扣减
系统必须能够获取大模型响应的 `usage`，按比例转换为积分并扣减。
#### Scenario: 余额不足拦截
- **WHEN** 租户的积分余额降至 0 或设定阈值以下时
- **THEN** 拦截新的对话流请求，返回 402 Payment Required 并阻断与 LLM 的通信。

## REMOVED Requirements
### Requirement: 全局文件共享记忆
**Reason**: 单用户模式下的 `USER.md` 和全局 `memory.json` 无法满足多租户的隐私和并发读写需求。
**Migration**: 将这部分记忆数据结构化，迁移到 PostgreSQL 数据库的租户专属表中。
