# Tasks
- [x] Task 1: 完善 API 鉴权 (Auth)
  - [x] SubTask 1.1: 排查并修改 `backend/app/gateway/routers/` 下的所有业务路由（如 `threads`, `runs`, `agents`），添加 `Depends(get_current_user)` 进行全局 JWT 鉴权保护。
  - [x] SubTask 1.2: 修改前端 `frontend/src/components/Login.tsx` 等，登录成功后调用真实的 `/auth/me` 接口获取用户信息，而不是使用 Mock 数据。

- [x] Task 2: 完善计费扣除闭环 (Billing)
  - [x] SubTask 2.1: 编写/更新 `token_usage_middleware.py`（或其他 Token 计算位置），实现根据 Token 消耗实时扣减数据库中用户 Credits 的逻辑。
  - [x] SubTask 2.2: 增加余额检查逻辑，如果用户 Credits 不足（或小于某个阈值），则拒绝发起新的 Agent Run 请求，返回相应的 402/403 错误。
  - [x] SubTask 2.3: 注释或挂起 Stripe Webhook 中的签名校验等不必要的复杂支付逻辑（因为测试阶段通过直接改数据库充值）。

- [x] Task 3: 完善前端和后端上传限制 (Storage)
  - [x] SubTask 3.1: 修改前端 `frontend/src/components/Chat.tsx` 或相关的上传组件，将文件上传限制为单文件最大 50MB，一次最多选择 5 个文件，超限给予前端报错提示。
  - [x] SubTask 3.2: 配合前端，将后端的 `MAX_FILE_SIZE` 常量修改为 50MB (52428800 bytes)，以保持前后端校验一致。

- [x] Task 4: 增加沙箱自动清理脚本 (Cleanup)
  - [x] SubTask 4.1: 在 `backend/scripts/` 目录下编写 `cleanup_sandbox.py` 脚本，用于扫描沙箱挂载目录，自动删除最后修改时间超过 7 天的临时文件或目录。
  - [x] SubTask 4.2: 提供配套的 Cron 任务设置指南，方便用户在云服务器上手动配置。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] can run parallel with [Task 1]
- [Task 4] can run parallel with [Task 1]