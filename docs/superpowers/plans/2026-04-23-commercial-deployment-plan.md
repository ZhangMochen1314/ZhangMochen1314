# DeepResValue Commercialization MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 开发一个基于“邀请码注册 + 点数消耗制”的商业化计费体系MVP版本。

**Architecture:**
- **Backend (FastAPI)**:
  - 增加 SQLite DB 和 SQLAlchemy 模型用于用户、邀请码和账单。
  - 新增 `auth_router.py` 提供 `/api/auth/register` 和 `/api/auth/login`。
  - 新增 `billing_router.py` 提供扣费与余额查询接口。
  - 新增 `admin_router.py` 用于生成邀请码和手动充值。
- **Frontend (Vite/React)**:
  - 增加登录/注册页面路由。
  - 在卡片和侧边栏展示技能价格和余额。
  - 拦截未登录或余额不足的操作。

**Tech Stack:** Python (FastAPI, SQLAlchemy, PyJWT), React (Zustand, TailwindCSS)

---

### Task 1: Database Setup (Auth & Billing Models)

**Files:**
- Create: `/workspace/deer-flow/backend/app/gateway/database.py`
- Create: `/workspace/deer-flow/backend/app/gateway/models.py`

- [ ] **Step 1: Setup SQLAlchemy and SQLite connection**
Create `database.py` with SQLAlchemy `create_engine` pointing to a local `billing.db`.

- [ ] **Step 2: Define Models**
Create `models.py`:
- `User` (id, email, hashed_password, credits, role)
- `InviteCode` (id, code, initial_credits, is_used, used_by_id)
- `BillingLog` (id, user_id, action, credits_change, timestamp)
- `SkillPricing` (id, skill_id, cost)

---

### Task 3: Backend Auth API (Register & Login)

**Files:**
- Create: `/workspace/deer-flow/backend/app/gateway/routers/auth.py`
- Modify: `/workspace/deer-flow/backend/app/gateway/app.py` (to include router)

- [ ] **Step 1: Implement `/register` endpoint**
Requires `email`, `password`, `invite_code`.
Validates `invite_code`, marks it used, creates `User` with `initial_credits`.

- [ ] **Step 2: Implement `/login` endpoint**
Verifies `email` and `password`, returns a JWT token.

---

### Task 4: Backend Billing & Admin API

**Files:**
- Create: `/workspace/deer-flow/backend/app/gateway/routers/billing.py`
- Create: `/workspace/deer-flow/backend/app/gateway/routers/admin.py`

- [ ] **Step 1: Implement `/admin/generate_invite`**
Admin-only route. Generates a random string code with specified initial credits.

- [ ] **Step 2: Implement `/admin/recharge`**
Admin-only route. Adds credits to a specified user ID.

- [ ] **Step 3: Implement `/billing/me` and `/billing/deduct`**
Get current user credits.
Deduct credits based on a provided `skill_id`.

---

### Task 5: Frontend Auth Integration

**Files:**
- Create: `/workspace/deer-flow/frontend/src/pages/Login.tsx`
- Create: `/workspace/deer-flow/frontend/src/pages/Register.tsx`
- Modify: `/workspace/deer-flow/frontend/src/store/useStore.ts`

- [ ] **Step 1: Setup Auth State**
Add `token`, `user`, and `credits` to Zustand store.

- [ ] **Step 2: Build UI Components**
Build simple Tailwind forms for Login and Register (including the Invite Code field).

---

### Task 6: Frontend Billing Integration

**Files:**
- Modify: `/workspace/deer-flow/frontend/src/pages/Chat.tsx`
- Modify: `/workspace/deer-flow/frontend/src/components/SkillCard.tsx` (if exists, or where skills are rendered)

- [ ] **Step 1: Display Prices and Balance**
Update the UI to fetch prices from the backend (or hardcode MVP prices) and display them on the skill cards.
Display user balance in the Navbar.

- [ ] **Step 2: Pre-check Balance**
Before sending a message that triggers a specific skill, check if `credits >= price`. If not, show a modal or toast: "余额不足，请联系管理员充值".

- [ ] **Step 3: Deduct on Success**
After receiving a successful response from the agent, call `/api/billing/deduct` to reduce the local and remote balance.