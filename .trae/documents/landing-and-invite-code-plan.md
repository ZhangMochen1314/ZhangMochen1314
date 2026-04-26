# 落地页与注册流程对齐计划

## 1. 摘要 (Summary)
用户提出了两个核心诉求：
1. **默认访问落地页**：网站打开时首先显示落地页（`Home.tsx`），用户点击登录/注册后才显示登录界面，并且登录界面需要符合落地页的高级学术杂志风格（Editorial/Magazine Academic + Glassmorphism）。
2. **强制使用内测码注册**：新用户注册时，必须提供内测邀请码。

## 2. 当前状态分析 (Current State Analysis)
- **前端路由**：通过之前的修改，`App.tsx` 已经将 `/` 路由映射到了 `Home`（落地页），并在其中集成了高水准的 `AuthModal.tsx`（鉴权弹窗），而不是独立的登录页面，这已经满足了“首先显示落地页”和“登录界面符合落地页风格”的要求。
- **后端 API**：`backend/app/auth/router.py` 中的 `/register` 接口已经包含了 `invite_code` 字段的校验逻辑，如果未提供或内测码无效，会返回 `400 Invalid invite code` 错误。
- **前端表单**：`AuthModal.tsx` 的注册视图（`view === "register"`）中，目前已经包含了一个必填的 `invite_code` 输入框。

## 3. 拟议变更 (Proposed Changes)

当前系统其实**已经基本满足**用户的需求，但是为了确保万无一失，我们可以进行以下验证和微调：

**步骤 1：前端路由与弹窗确认**
- 检查 `App.tsx` 确保 `/` 路由直接指向 `Home` 组件。
- 确认 `Home.tsx` 中的按钮（如“进入研究室”或“免费注册体验”）能够正确拉起 `AuthModal`。
- 确认 `AuthModal.tsx` 的视觉风格已经使用了 `brand-guidelines` 中的字体（Poppins/Lora）和颜色（#141413, #faf9f5, #d97757, #6a9bcc），并且具备毛玻璃效果。

**步骤 2：强化注册界面的“内测码”概念**
- 在 `AuthModal.tsx` 中，将原本的“专属邀请码”标签文案调整为“内测邀请码”，以更贴合用户提到的“内测码”概念。
- 在输入框的 placeholder 中明确提示“必填，需使用官方内测码或好友邀请码注册”。

**目标文件:**
- `/workspace/DeepResValue_WebApp/deer-flow/frontend/src/components/AuthModal.tsx`

## 4. 假设与设计决策 (Assumptions & Decisions)
- 用户可能没有注意到我们在上一步已经将登录/注册改为了在落地页上弹出的 `AuthModal`，我们需要在完成修改后，再次向用户解释并引导其预览。
- “内测码”和“邀请码”在后端逻辑上是同一套机制（`SystemInvite` 和 `User.invite_code`），无需修改后端，只需调整前端文案即可。

## 5. 验证步骤 (Verification)
- 启动前端服务，访问 `/`。
- 确认首先看到的是华丽的落地页。
- 点击注册按钮，确认弹出的 `AuthModal` 具有高级的毛玻璃和学术风格。
- 确认注册表单中存在必填的“内测邀请码”字段。