# DeepResValue (DeerFlow) Commercialization Spec (MVP)

## 1. Goal
将现有的单机版 `DeepResValue` 科研智能体平台转变为支持多用户、**按量计费（Token/点数消耗制）**的商业化 SaaS 平台。
第一阶段（MVP）主要解决：用户的访问控制（邀请码+邮箱）、技能的分级计费展示与扣除、以及一个供管理员生成邀请码和手工充值的管理后台。

## 2. Architecture & Modules

### 2.1 账户与访问控制体系 (IAM)
- **注册流程**：用户需使用 **邮箱 + 密码** 进行注册，但**强制要求输入有效的邀请码 (Invite Code)** 才能注册成功并获得初始点数。
- **登录流程**：标准的 JWT 登录认证，前端保存 Token。
- **用户信息**：在界面的 Navbar 或侧边栏，实时展示用户当前的**剩余点数 (Credits)**。

### 2.2 技能计费引擎 (Billing Engine)
- **动态定价配置**：在后端（如数据库表 `skills_pricing` 或配置文件）中维护每个技能的消耗点数。管理员可随时修改每个模块的消耗参数。
  - 例如：`DeepResValue-Literature-Search` (2点), `DeepResValue-Spatial` (5点), 普通问答 (1点)。
- **前端明码标价**：在现有的 8 个科研技能卡片上，右上角或底部展示类似 🪙 `2 Points/次` 的徽章。
- **扣费拦截器 (Middleware/Interceptor)**：
  - 在 LangGraph 后端网关拦截请求。
  - 检查用户余额：若余额 < 该技能所需点数，拒绝请求并返回“余额不足请联系管理员充值”的提示。
  - 请求完成后（或开始时），从用户账户中扣除相应点数，并记录在 `billing_logs` 表中。

### 2.3 管理员后台 (Admin Dashboard)
- **邀请码管理**：生成、吊销邀请码，并设置每个邀请码对应的**初始赠送点数**。
- **用户管理**：查看所有已注册用户列表、剩余点数、历史消耗日志。
- **手动充值**：点击某个用户，手动输入增加或减少的点数（用于 MVP 阶段的“人工客服充值”）。
- **定价管理**：在后台界面直接修改各个技能的消耗点数，前端实时生效。

## 3. Tech Stack & Implementation Steps
- **Database**: 引入 SQLite (MVP) 或 PostgreSQL 存储用户 (`users`), 邀请码 (`invite_codes`), 消耗日志 (`transaction_logs`) 和 定价表 (`skill_pricing`)。
- **Backend (FastAPI)**:
  - 新增 `/api/auth/register`, `/api/auth/login` 路由。
  - 新增 `/api/billing/deduct` 计费中间件。
  - 新增 `/api/admin/*` 路由供管理后台调用。
- **Frontend (Vite/React)**:
  - 开发登录页 (`Login.tsx`) 和注册页 (`Register.tsx`)。
  - 更新 `useStore.ts` 增加 `user` 和 `credits` 状态。
  - 开发一个简单的隐藏路由 `/admin` 作为管理后台。

## 4. Expected User Flow
1. 用户拿到站长（您）分发的邀请码（内含 50 点初始额度）。
2. 用户访问网页，点击注册，输入邮箱、密码和邀请码。
3. 注册成功自动登录，主页右上角显示：👤 `user@test.com` | 🪙 `50 Points`。
4. 用户点击“空间计量分析”（卡片上写着 🪙 `5 Points`），上传数据并提问。
5. 后端校验余额 50 > 5，允许执行。
6. 空间计量分析完成，用户余额变为 `45 Points`。
7. 当余额耗尽，用户通过微信联系站长，站长在 `/admin` 后台找到该邮箱，手动充值 100 点。