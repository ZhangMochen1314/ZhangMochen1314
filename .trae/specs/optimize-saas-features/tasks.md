# Tasks
- [x] Task 1: 数据库模型与权限控制 (RBAC) 升级
  - [x] SubTask 1.1: 在 `app/auth/models.py` 中为 User 模型增加 `role` 和 `tier` 字段
  - [x] SubTask 1.2: 创建 Admin 权限校验依赖 (`get_current_admin_user`) 并应用到管理路由
  - [x] SubTask 1.3: 编写对应的后端与前端路由（如 Admin Dashboard 界面）

- [x] Task 2: 接口限流与安全性优化
  - [x] SubTask 2.1: 引入 `slowapi` 等中间件实现基于 IP 或 Token 的频率限制
  - [x] SubTask 2.2: 在 FastAPI 的核心生成接口（如 `/api/chat`）配置限流规则
  - [x] SubTask 2.3: 添加并验证 429 错误响应的单元测试

- [x] Task 3: 分布式架构与 Redis 集成
  - [x] SubTask 3.1: 完善 `deerflow/config/stream_bridge_config.py`，实现 `RedisStreamBridge`（移除 `NotImplementedError`）
  - [x] SubTask 3.2: 升级 `docker-compose.yml`，为生产环境部署加入 Redis 服务支持

- [x] Task 4: 计费、账单与支付网关对接准备
  - [x] SubTask 4.1: 创建 `Subscription`, `Transaction`, `Order` 数据模型用于追踪消耗与充值
  - [x] SubTask 4.2: 提供充值回调接口模板（预留 Stripe / 支付宝 / 微信支付 的 Webhook）

- [x] Task 5: 监控、日志与生产环境适配
  - [x] SubTask 5.1: 引入 `sentry-sdk` 用于捕获后端异常
  - [x] SubTask 5.2: 引入 `prometheus_client` 为 FastAPI 添加 Metrics 接口 (`/metrics`)

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 3] depends on [Task 2]
