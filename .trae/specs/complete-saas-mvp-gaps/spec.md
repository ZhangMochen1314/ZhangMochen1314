# Complete SaaS MVP Gaps Spec

## Why
当前代码在鉴权、计费扣费闭环、上传限制以及临时文件清理等方面存在缺陷。为了确保能在云服务器上稳定、安全地测试并运行系统，防止资源被滥用并打通最基础的商业测试流程，需要补充完善这四个核心模块。计费模块暂缓真实支付对接，重点放在使用模型时的自动积分（Credits）扣除上，积分充值通过手动操作数据库完成。

## What Changes
- **Auth**: 为所有的后端核心业务路由（包括 `/api/threads`, `/api/runs`, `/api/agents` 等）增加强制 JWT 鉴权依赖。
- **Auth (Frontend)**: 前端移除硬编码的 Mock 用户数据，在登录成功后调用真实的 `/auth/me` 接口。
- **Billing**: 完善 `token_usage_middleware.py` 和业务逻辑，在运行 Agent 消耗 Token 后，自动从数据库中扣减用户的 Credits。余额不足时拦截请求。
- **Storage/Frontend**: 修改前端上传逻辑，单文件大小限制在 50MB，一次最多允许上传 5 个文件。后端校验同样配合修改最大大小限制。
- **Cleanup**: 编写一个 Cron 定时任务脚本，自动清理云服务器上（或本地文件系统挂载的）7 天前的临时沙箱文件。
- 确保有清晰的手动部署数据库（PostgreSQL + Redis）指导或脚本，方便在云端配置测试环境。

## Impact
- Affected specs: Auth, Billing, Upload, Sandbox Cleanup
- Affected code:
  - `backend/app/gateway/routers/*.py` (增加鉴权)
  - `backend/app/middleware/token_usage_middleware.py` (扣费逻辑)
  - `frontend/src/components/Login.tsx` (获取真实用户信息)
  - `frontend/src/components/Chat.tsx` (前端上传限制 50MB, 5 个文件)
  - `backend/scripts/cleanup_sandbox.py` (新建清理脚本)

## ADDED Requirements
### Requirement: 强制积分扣除逻辑
系统应当根据用户的 Token 消耗自动扣减积分，积分可由管理员手动修改数据库充值。

#### Scenario: Success case
- **WHEN** 用户触发大模型运行并消耗 Token
- **THEN** 系统自动扣除对应的 Credits，若 Credits 耗尽，再次请求将被拒绝。

### Requirement: 前端严格上传限制
前端文件选择器应限制单次最多选中 5 个文件，且阻止超过 50MB 的文件上传。

#### Scenario: Success case
- **WHEN** 用户尝试上传 6 个文件或单文件 60MB
- **THEN** 前端提示错误并拒绝开始上传流程。

### Requirement: 自动清理机制
系统应提供一个可供 Linux Cron 调用的清理脚本。

#### Scenario: Success case
- **WHEN** 脚本被 Cron 触发
- **THEN** 自动删除修改时间超过 7 天的沙箱工作区目录。

## MODIFIED Requirements
### Requirement: 全局鉴权保护
所有创建对话、发送消息和使用 Agent 的 API 必须验证合法的 JWT Token。