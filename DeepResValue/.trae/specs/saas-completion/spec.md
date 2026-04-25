# SaaS 产品化最后一公里 (SaaS Completion) Spec

## Why
当前 DeepResValue 项目已经具备了坚实的后端基础（JWT鉴权、多租户隔离、积分计费引擎），但在面向 C端/B端 用户时，缺乏完整的前端鉴权页面（登录/注册）和真实的资金通道（支付宝电脑网站支付）。为了实现商业化闭环，必须补齐这些“最后一公里”的用户界面和支付网关集成。

## What Changes
- **前端鉴权闭环**：新增 `Login.tsx` 和 `Register.tsx` 页面，对接现有的后端 `/api/auth` 接口，并使用 React Router 实现路由守卫（未登录重定向）。
- **支付宝支付网关集成**：**BREAKING** 改造后端的 `/api/points/top-up` 接口，不再直接增加积分，而是调用支付宝“电脑网站支付”SDK 生成付款链接。
- **异步支付回调处理**：新增后端 Webhook 路由 `/api/webhooks/alipay`，接收并验签支付宝的异步通知，确认收款后自动为用户增加积分。
- **前端充值交互**：改造 `Home.tsx` 中的定价套餐卡片，点击后调用后端获取支付宝付款链接并重定向或展示二维码。
- **用户控制台与历史账单**：新增 `Dashboard.tsx`，展示用户信息、积分余额以及调用 `/api/points/ledger` 获取的详细消费/充值流水。

## Impact
- Affected specs: 用户认证体系、积分充值与计费账单、前端路由体系。
- Affected code:
  - Frontend: `src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/pages/Dashboard.tsx`, `src/App.tsx`, `src/store/useStore.ts`, `src/pages/Home.tsx`
  - Backend: `app/gateway/routers/points.py`, `app/gateway/services/payment.py` (新增), `app/models.py` (新增 Order 模型)

## ADDED Requirements
### Requirement: 前端登录注册与路由保护
系统必须提供美观的登录注册表单，并保护核心业务页面。
#### Scenario: 未登录用户访问工作台
- **WHEN** 未持有有效 JWT Token 的用户尝试访问 `/chat` 或 `/dashboard`
- **THEN** 路由守卫拦截请求，自动重定向至 `/login` 页面。

### Requirement: 支付宝电脑网站支付集成
系统必须支持真实的资金充值通道，允许用户购买积分套餐。
#### Scenario: 用户购买 2000 积分套餐
- **WHEN** 用户在前端点击“科研包（¥99/2000积分）”
- **THEN** 后端生成一条 `pending` 状态的订单，调用支付宝 SDK 返回收银台 URL，前端重定向至支付宝页面供用户扫码或登录付款。

### Requirement: 异步支付通知与自动加款
系统必须能够安全、可靠地处理支付宝的异步到账通知。
#### Scenario: 支付宝回调通知付款成功
- **WHEN** 支付宝服务器向 `/api/webhooks/alipay` 发送包含签名和订单状态的 POST 请求
- **THEN** 后端使用支付宝公钥验签成功，检查订单状态为 `TRADE_SUCCESS`，将订单更新为 `paid`，在 `PointsLedger` 中记录充值流水，并为用户账户增加 2000 积分。

## MODIFIED Requirements
### Requirement: 现有充值接口改造
**Reason**: 现有的 `/api/points/top-up` 是测试桩，直接信任前端传入的 amount 并加分，存在极大的安全漏洞。
**Migration**: 将其改造为“创建支付订单”接口，接收 `package_id` 或 `amount`，返回 `pay_url` 和 `out_trade_no`。

## REMOVED Requirements
### Requirement: 纯前端虚拟积分扣减
**Reason**: 现有的 `useStore.ts` 中直接在前端进行 `deductPoints` 和 `addPoints`，虽然展示直观，但商业化后必须以后端的真实数据为准。
**Migration**: 保留前端状态用于乐观 UI 更新，但核心积分数据必须在页面加载或操作后通过 `/api/points/balance` 接口从后端同步校验。