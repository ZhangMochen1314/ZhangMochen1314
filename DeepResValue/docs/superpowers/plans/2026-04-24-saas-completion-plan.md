# SaaS 产品化最后一公里 (SaaS Completion) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补齐 DeepResValue 项目从“内部 API 系统”走向“完整商业化 SaaS 产品”所缺失的前端用户界面（鉴权、充值、控制台）与后端支付网关（微信/支付宝等）闭环逻辑。

**Architecture:**
- **Frontend (React/Vite)**: 增加 React Router 拦截器保护私有路由，使用现有的 Tailwind/UI 库搭建登录注册页、用户工作台（账单明细）、支付套餐页。
- **Backend (FastAPI)**: 接入真实支付网关 SDK 生成支付链接/二维码，并新增 Webhook 路由处理异步到账回调以安全充值积分；补齐邮件发送服务以支持密码找回。

**Tech Stack:** React, React Router, TailwindCSS, FastAPI, Alipay/WeChat Pay SDK (or Stripe), smtplib.

---

### Task 1: 前端鉴权与用户路由闭环

**Files:**
- Create: `frontend/src/pages/Login.tsx`
- Create: `frontend/src/pages/Register.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/store/useStore.ts` (or create `useAuth.ts`)

- [ ] **Step 1: 编写 Zustand 鉴权状态管理**
  在全局 Store 中存储 JWT Token 和当前登录的 User Info，并实现 `login()`, `logout()`, `register()` 的 API 调用方法。

- [ ] **Step 2: 搭建登录与注册 UI 页面**
  创建美观的表单页面，包含邮箱、密码输入框，以及错误提示（如账号不存在、密码错误）。登录成功后将 JWT 写入 LocalStorage 并跳转至首页。

- [ ] **Step 3: 配置前端路由守卫 (Protected Routes)**
  修改 `App.tsx`，将 `Chat.tsx` 等核心业务页面包裹在鉴权高阶组件中。未登录用户访问时自动重定向至 `/login`。

---

### Task 2: 用户控制台与账单明细 UI

**Files:**
- Create: `frontend/src/pages/Dashboard.tsx`
- Create: `frontend/src/components/BillingHistory.tsx`
- Modify: `frontend/src/components/Navbar.tsx`

- [ ] **Step 1: 导航栏展示用户状态**
  在 Navbar 右侧增加用户头像下拉菜单，显示当前“积分余额”，并提供“充值”和“个人中心”的入口。

- [ ] **Step 2: 搭建控制台概览页 (Dashboard)**
  创建一个用户中心页面，展示用户的注册邮箱、当前剩余积分、以及本月 Token 消耗统计图表。

- [ ] **Step 3: 账单流水列表组件**
  调用后端的 `/api/points/ledger` 接口，以表格形式展示用户的每一笔消费和充值记录（时间、类型、数额、余额）。

---

### Task 3: 真实支付网关接入 (Backend)

**Files:**
- Create: `backend/app/gateway/services/payment.py`
- Modify: `backend/app/gateway/routers/points.py`

- [ ] **Step 1: 集成支付 SDK (如 Alipay)**
  编写支付服务类，调用支付宝/微信或 Stripe 的 SDK，传入商品标题（如“DeepResValue 1000积分套餐”）、价格和本地订单号，生成支付二维码 URL 或收银台跳转链接。

- [ ] **Step 2: 改造现有的 Top-up 接口**
  将原先“直接修改数据库加积分”的危险逻辑，改为：生成本地 `Order` 记录（状态为 `pending`） -> 调用支付 SDK 生成链接 -> 返回支付链接给前端。

- [ ] **Step 3: 实现异步支付回调 (Webhook)**
  新增 `POST /api/webhooks/payment` 路由，接收支付平台的异步通知。验证签名通过且状态为成功后，将对应的 `Order` 设为 `paid`，并安全地在数据库中为该用户增加积分余额。

---

### Task 4: 前端充值套餐页与扫码交互

**Files:**
- Create: `frontend/src/pages/Pricing.tsx`
- Create: `frontend/src/components/PaymentModal.tsx`

- [ ] **Step 1: 搭建定价套餐页**
  展示 3-4 个梯度的积分套餐卡片（如：基础版 ¥9.9=1000积分，专业版 ¥49.9=6000积分）。

- [ ] **Step 2: 支付二维码弹窗交互**
  用户点击购买后，调用后端的 Top-up 接口获取支付链接。如果返回的是二维码 URL，使用 `qrcode.react` 库在弹窗中渲染出真实的支付二维码供用户扫码。

- [ ] **Step 3: 订单状态轮询**
  在支付弹窗打开期间，前端每隔 3 秒轮询后端查询该订单状态。一旦后端 Webhook 收到付款通知将订单设为已支付，前端弹窗立即显示“支付成功”并刷新右上角的积分余额。

---

### Task 5: 邮件服务与密码找回闭环

**Files:**
- Create: `backend/app/gateway/services/email.py`
- Modify: `backend/app/gateway/routers/auth.py`

- [ ] **Step 1: 编写邮件发送工具类**
  配置 SMTP（如阿里云邮件推送或 SendGrid），实现发送 HTML 验证邮件的功能。

- [ ] **Step 2: 生成与验证重置 Token**
  当用户请求找回密码时，生成一个有效期为 15 分钟的签名 Token，并将其拼接为密码重置页面的 URL 发送至用户邮箱。

- [ ] **Step 3: 完善重置密码 API**
  新增一个接收重置 Token 和新密码的 API，校验签名无误后更新数据库中的哈希密码。