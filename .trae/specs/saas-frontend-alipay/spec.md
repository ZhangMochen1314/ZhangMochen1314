# SaaS 商业化基础功能完善 Spec

## Why
当前系统已具备了核心的后端能力，但前端的登录、注册页面较为简陋，缺乏 SaaS 级别的视觉体验和商业化闭环。同时，为了在国内市场开展商业化运作，后端需要集成支付宝（Alipay）作为支付网关，并打通前端的文件传输交互与历史对话记录（Threads）的展示，以提升用户的粘性和产品完整度。

## What Changes
- 重构 `frontend/src/pages/Login.tsx` 和 `Register.tsx`，引入现代化的 UI 组件（如 Tailwind + shadcn/ui 风格的设计）。
- 在后端 `backend/app/billing/` 目录下集成 `python-alipay-sdk`，新增创建支付宝支付订单和处理异步 Webhook（充值积分）的接口。
- 在前端 `Chat.tsx` 或全局布局中，集成侧边栏以拉取并展示用户的历史对话记录（调用 `/api/threads`）。
- 在前端对话页面中实现文件上传交互，调用后端的 `/api/threads/{thread_id}/uploads` 接口支持数据传输。

## Impact
- Affected specs: 无
- Affected code: `frontend/src/pages/Login.tsx`, `frontend/src/pages/Register.tsx`, `frontend/src/pages/Chat.tsx`, `backend/app/billing/router.py`, `backend/app/billing/alipay_client.py`

## ADDED Requirements
### Requirement: 支付宝网关集成
系统 SHALL 提供支付宝 PC 电脑网站支付的下单接口和回调接口，并在用户支付成功后增加对应账号的 `credits` 积分。

#### Scenario: 成功充值积分
- **WHEN** 支付宝 Webhook 回调推送支付成功（`TRADE_SUCCESS`）且验签通过
- **THEN** 后端自动在 `users` 表中为对应的用户增加所购买套餐的积分。

### Requirement: 历史对话与文件传输
系统 SHALL 在前端提供直观的历史记录侧边栏，并允许用户在当前会话中上传文件供后端大模型分析。

#### Scenario: 用户上传数据并回顾历史
- **WHEN** 用户在侧边栏点击过往的会话记录
- **THEN** 界面恢复该次对话的内容；用户可通过输入框旁边的按钮上传本地 CSV 文件。