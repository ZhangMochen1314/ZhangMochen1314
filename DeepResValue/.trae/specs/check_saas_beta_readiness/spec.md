# SaaS 内测就绪度审查与完善 (SaaS Beta Readiness) Spec

## Why
当前 DeepResValue 项目已经具备了落地页、用户鉴权、积分扣费以及支付宝网关，但在即将面向真实用户的**封闭内测（Closed Beta）**阶段，系统仍缺失一些关键的产品闭环：
1. **邀请码机制未闭环**：用户无法在控制台查看并复制自己的专属邀请码，无法自发进行裂变传播；管理员也缺乏生成初始内测码（`BetaInviteCode`）的工具。
2. **缺乏防刷与限流（Rate Limiting）**：对于核心的大模型推理流（`/api/threads/*/runs/stream`）接口，如果不加任何频率限制，极易被恶意脚本耗尽 Aliyun FC 或 LLM 额度。
3. **缺少用户反馈（Feedback）渠道**：内测阶段难免遇到产品 Bug 或数据清洗失败的情况，必须在聊天界面或导航栏提供便捷的“反馈/报错”入口，帮助产研团队收集第一手优化建议。
4. **缺少新手引导（Onboarding）**：对于全新的 Chat 会话，当消息列表为空时缺乏友好的操作引导，用户可能不知道如何发出“Vibe Coding”指令。

## What Changes
- **新增后端邀请码生成工具**：在后端提供一个简单的脚本或受保护的 API，用于批量生成 `BetaInviteCode`。
- **完善控制台（Dashboard.tsx）**：增加一个「我的邀请码」展示区块，并支持一键复制，明确展示“邀请得 100 积分”的利益点。
- **引入用户反馈机制（Feedback）**：
  - 后端：在 `models.py` 新增 `UserFeedback` 表，提供对应的 POST 接口。
  - 前端：在 Navbar 或 Chat 界面增加「反馈 Bug / 建议」入口，点击后弹出反馈模态框。
- **实现基础 API 限流（Rate Limiting）**：
  - 在 FastAPI 中集成 `slowapi`（或简单的基于 Redis/内存 的限流器），针对聊天提问接口限制请求频率（例如：5 次 / 分钟），防止羊毛党恶意耗费算力。
- **添加 Chat 空状态引导（Empty State）**：在 `Chat.tsx` 初始化或无消息时，展示几个快速入门的提示词（Prompt 模板），点击后即可填入输入框。

## Impact
- Affected specs: 闭环了 `saas-completion` 阶段设计的邀请码注册流程。
- Affected code:
  - `backend/app/models.py` (新增 Feedback 模型)
  - `backend/app/main.py` & `backend/app/gateway/routers/` (新增限流器、反馈 API)
  - `frontend/src/pages/Dashboard.tsx` (UI 完善)
  - `frontend/src/pages/Chat.tsx` (空状态与反馈 UI)
  - `backend/scripts/generate_beta_codes.py` (新脚本)

## ADDED Requirements
### Requirement: 用户裂变邀请
- **WHEN** 用户登录进入控制台时
- **THEN** 应当能够清晰地看到自己的专属邀请码（`user.invite_code`），并能够一键复制分享给他人。

### Requirement: 内测反馈收集
- **WHEN** 用户在使用过程中遇到 Bug 或有建议时
- **THEN** 可以点击右上角的「反馈」按钮，填写文字并提交，管理员能够在数据库的 `UserFeedback` 表中查看。

### Requirement: 核心接口限流防刷
- **WHEN** 某个用户在短时间内高频调用 LLM 聊天流接口
- **THEN** 系统应拦截超出频率（如 5次/分钟）的请求，并返回 `429 Too Many Requests`，提示用户“请求过于频繁，请稍后再试”。
