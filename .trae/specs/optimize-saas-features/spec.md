# Optimize SaaS Features Spec

## Why
目前 `deer-flow` 的核心 AI Agent 平台功能和底层架构已初步成型，但在向商业化 SaaS 产品演进的过程中，仍缺乏必要的多租户管理、商业化计费、系统高可用性、安全性和可观测性基础设施。为了支持产品的正式上线和规模化运营，需要全面完善这些 SaaS 必备组件。

## What Changes
- 引入用户角色与基于角色的访问控制（RBAC），区分普通用户、付费订阅用户与系统管理员。
- 增加接口限流（Rate Limiting）和 API 配额管理（Token/Credits 消耗限制），防止恶意刷量和接口滥用。
- 完善计费与订阅模块（Subscription/Billing），提供标准化的支付订单流与回调机制（如 Stripe/支付宝/微信支付）。
- 补全分布式流式通信（Redis Stream Bridge），替换现有的单机内存队列（MemoryStreamBridge），支持网关的水平扩展和高可用。
- 引入应用性能监控（APM）和集中式日志（如 Sentry, Prometheus/Grafana）。

## Impact
- Affected specs: 用户认证模块、网关通信机制、数据库模型定义、配置加载与环境变量模块。
- Affected code: `backend/app/auth/`、`backend/app/gateway/`、`backend/deerflow/config/` 以及前端控制台页面。

## ADDED Requirements
### Requirement: RBAC 角色权限控制
系统必须支持区分不同的用户角色，并对核心管理接口进行权限拦截。

#### Scenario: 管理员访问控制面板
- **WHEN** 拥有 `admin` 角色的用户请求管理接口 `/api/admin/users`
- **THEN** 系统应返回 200 及所有用户列表。若普通用户请求该接口，应返回 403 Forbidden。

### Requirement: 接口限流与防滥用
系统核心的大模型生成接口必须实施频率限制（例如每分钟 10 次请求）。

#### Scenario: 触发限流阈值
- **WHEN** 同一用户在 1 分钟内对 `/api/chat` 发起超过限制次数的请求
- **THEN** 系统应拒绝请求并返回 429 Too Many Requests 状态码及 `Retry-After` 响应头。

### Requirement: 分布式流式通信
为了支持分布式部署，网关层的 SSE（Server-Sent Events）必须支持通过 Redis Pub/Sub 或 Streams 转发消息。

#### Scenario: 多节点消息推送
- **WHEN** Agent 任务在 Node A 运行并产生中间状态，而用户的 WebSocket/SSE 客户端连接在 Node B
- **THEN** 系统通过 Redis 桥接机制，使 Node B 能够实时接收并向用户推送该消息。

## MODIFIED Requirements
### Requirement: 用户积分/额度系统
原有的 `credits` 静态字段需重构为完整的账户余额与消费流水账单体系（Ledger/Transactions），确保资金与 Token 消耗的事务一致性。

## REMOVED Requirements
### Requirement: 纯内存单机架构假设
**Reason**: 无法满足生产环境多实例部署（横向扩展）的需求。
**Migration**: 配置中强制生产环境启用 Redis 并使用 `PostgreSQL`，废弃 `MemoryStreamBridge` 在生产环境的默认使用。
