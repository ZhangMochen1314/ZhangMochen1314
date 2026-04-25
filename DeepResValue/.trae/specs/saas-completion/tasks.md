# Tasks

## Phase 1: 前端鉴权与用户路由闭环
- [x] Task 1.1: 编写 Zustand 鉴权状态管理。在 `frontend/src/store/useStore.ts`（或新建 `useAuthStore.ts`）中存储 JWT Token、User Info，实现 `login()`, `logout()`, `register()` 等 API 调用。
- [x] Task 1.2: 搭建登录与注册 UI 页面。在 `frontend/src/pages/` 下创建 `Login.tsx` 和 `Register.tsx`，使用 TailwindCSS 构建美观的表单，并在成功后将 JWT 写入 LocalStorage。
- [x] Task 1.3: 配置前端路由守卫 (Protected Routes)。修改 `frontend/src/App.tsx`，将 `Chat.tsx`, `Datasets.tsx` 等核心页面包裹在鉴权组件中，未登录自动重定向。

## Phase 2: 用户控制台与账单明细 UI
- [x] Task 2.1: 导航栏展示用户状态。修改 `frontend/src/components/Navbar.tsx` 右侧，显示用户头像、实时积分余额，提供“控制台”和“退出登录”入口。
- [x] Task 2.2: 搭建控制台概览页 (Dashboard)。创建 `Dashboard.tsx`，展示用户的注册邮箱、当前剩余积分等信息。
- [x] Task 2.3: 账单流水列表组件。在 Dashboard 中调用后端的 `/api/points/ledger` 接口，以表格形式展示用户的每一笔消费和充值记录（时间、类型、数额、余额）。

## Phase 3: 真实支付网关接入 (Backend)
- [x] Task 3.1: 新增数据库订单模型。在 `backend/app/models.py` 中添加 `Order` 模型（包含 `out_trade_no`, `user_id`, `amount`, `points`, `status` 等字段）。
- [x] Task 3.2: 集成支付宝 SDK。在 `backend/pyproject.toml` 中安装 `python-alipay-sdk`。在 `backend/app/gateway/services/payment.py` 中初始化 `AliPay` 客户端。
- [x] Task 3.3: 改造现有的 Top-up 接口。在 `backend/app/gateway/routers/points.py` 中，将 `/api/points/top-up` 改为：生成本地 `pending` 状态的订单 -> 调用支付宝电脑网站支付 SDK (`alipay.trade.page.pay`) 生成支付链接 -> 返回给前端。
- [x] Task 3.4: 实现异步支付回调 (Webhook)。新增 `POST /api/webhooks/alipay` 路由，接收支付宝的表单通知。验证签名通过且状态为成功后，将订单设为 `paid`，并安全地在数据库中为该用户增加积分余额和流水记录。

## Phase 4: 前端充值套餐页与扫码交互
- [x] Task 4.1: 改造现有的定价套餐页。修改 `frontend/src/pages/Home.tsx` 中现有的套餐卡片（如“基础包”、“科研包”），增加点击购买事件。
- [x] Task 4.2: 支付跳转与订单状态轮询。用户点击购买后，调用后端的 Top-up 接口获取支付链接并重定向至支付宝收银台。

# Task Dependencies
- [Phase 2] depends on [Phase 1]
- [Phase 3] depends on [Phase 1]
- [Phase 4] depends on [Phase 2] and [Phase 3]