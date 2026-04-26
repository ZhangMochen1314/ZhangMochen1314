# Tasks

## Phase 1: 邀请机制闭环与管理员工具
- [x] Task 1.1: 创建内测码生成脚本。在 `backend/scripts/` 目录下创建一个 `generate_beta_codes.py`，允许通过命令行批量生成并写入指定数量的 `BetaInviteCode` 到数据库中。
- [x] Task 1.2: 完善 Dashboard 邀请码 UI。在 `frontend/src/pages/Dashboard.tsx` 中新增一个卡片，展示当前登录用户的 `invite_code`（从 `user` 状态中读取），并提供一个美观的“一键复制”按钮和裂变文案（“邀请好友注册，各得积分”）。

## Phase 2: 新手引导与产品反馈收集
- [x] Task 2.1: 建立用户反馈数据模型与接口。在 `backend/app/models.py` 新增 `UserFeedback` 模型（包含 `user_id`, `content`, `type`, `status`, `created_at`）。在 `backend/app/gateway/routers/` 中新增 POST 接口保存反馈。
- [x] Task 2.2: 前端新增反馈入口与模态框。在 `frontend/src/components/Navbar.tsx` 或 `Chat.tsx` 右上角增加“反馈 Bug”按钮，点击弹出一个带有文本域和提交按钮的弹窗，提交后调用反馈接口。
- [x] Task 2.3: Chat 空状态（Empty State）引导。在 `frontend/src/pages/Chat.tsx` 中，当 `messages.length === 0` 时，居中展示 Vibe Coding 的欢迎语，并提供 3-4 个快捷预设问题（如：“帮我分析一份面板数据”、“什么是固定效应模型？”），点击可直接填充输入框。

## Phase 3: 核心接口限流保护 (Rate Limiting)
- [x] Task 3.1: 引入后端限流依赖。在 `backend/pyproject.toml` 中通过 `uv add slowapi` 安装限流库。
- [x] Task 3.2: 全局与核心路由配置限流。在 `backend/app/main.py` 中初始化 `slowapi`，重点对 `backend/app/gateway/routers/threads.py` 中的 `POST /api/threads/{thread_id}/runs/stream` 接口施加合理的限流（例如 `5/minute`），并在超限时返回标准的友好报错。

# Task Dependencies
- [Phase 1] 可以与 [Phase 2] 并行开发。
- [Phase 3] 为后端安全性增强，可以在最后集成测试。
