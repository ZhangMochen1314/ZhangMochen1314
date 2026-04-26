# Authentication UI Alignment Plan

## 1. 摘要 (Summary)
The user wants the authentication interface to strictly match the aesthetic style of the newly redesigned landing page. Currently, the `AuthModal.tsx` handles both login and registration, but it may lack some of the sophisticated "Glassmorphism" and "Editorial Academic" visual polish applied to the rest of the landing page. We need to upgrade `AuthModal.tsx` using `brand-guidelines` and `frontend-design` principles to ensure a seamless, premium transition from the landing page to the auth flow.

## 2. 当前状态分析 (Current State Analysis)
- The landing page opens first by default, which correctly fulfills the user's request: "网页打开显示落地页 用户点击登录后才显示登录界面".
- The auth interface is implemented as a modal (`AuthModal.tsx`) that pops up over the landing page.
- The current modal uses basic Anthropic brand colors (`#faf9f5` background, `#141413` text), but the layout and input fields are somewhat standard. It lacks the deep "Glassmorphism" feel, the high-end academic magazine aesthetic, and the polished motion details present in components like `HeroSection` or `RewardsSection`.

## 3. 拟议变更 (Proposed Changes)

**目标文件:** `/workspace/DeepResValue_WebApp/deer-flow/frontend/src/components/AuthModal.tsx`

**步骤 1：重构 Modal 容器视觉 (Refactor Container Aesthetics)**
- 增强毛玻璃背景：将外层遮罩的背景从简单的 `bg-[#141413]/60` 升级为带有更强模糊效果和品牌色彩点缀的背景。
- 升级卡片质感：采用类似于 `CompetitionSection` 或 `HeroSection` 浮窗的设计。使用半透明背景配合 `backdrop-blur`，添加高光边框（`border-white/20`）和柔和的阴影扩散（`shadow-[0_0_50px_rgba(0,0,0,0.15)]`）。

**步骤 2：优化表单排版与字体 (Optimize Typography & Layout)**
- 严格遵循 `brand-guidelines`：标题使用 `Poppins`，正文和标签使用 `Lora`。
- 增加视觉层级：使用 `#d97757`（橙色）或 `#6a9bcc`（蓝色）作为强调色，例如高亮 "50 积分" 等转化文案。

**步骤 3：定制输入框与按钮 (Custom Inputs & Buttons)**
- 覆盖默认的 `Input` 样式：使用带有轻微背景色、获得焦点时出现平滑品牌色边框（`focus:ring-[#6a9bcc]/30 focus:border-[#6a9bcc]`）的定制输入框，抛弃默认的灰色边框。
- 按钮升级：使提交按钮更大气，增加悬浮时的缩放或发光动效。

**步骤 4：左侧或顶部的品牌视觉锚点 (Optional Brand Anchor)**
- 在模态框内部（或者顶部）增加一个小的品牌 Logo 或图标（例如 `BrainCircuit`），以强化品牌认知。

## 4. 假设与设计决策 (Assumptions & Decisions)
- **Modal vs 独立页面**：保留 Modal 设计，因为它允许用户在不离开精美落地页上下文的情况下完成鉴权，这符合现代 SaaS 的最佳实践，也满足了用户“点击登录后才显示”的要求。
- **Aesthetic Choice**：选择 "Refined / High-end Academic"（精致/高端学术）风格。表单必须看起来像是一个顶级科研工具的入口，而不是一个普通的 SaaS 注册表单。

## 5. 验证步骤 (Verification)
- 启动前端开发服务器。
- 在浏览器中点击“进入研究室”或“输入邀请码注册”。
- 验证弹出的 AuthModal 是否在视觉质感（色彩、字体、毛玻璃、阴影）上与底部的落地页完美融合。
- 测试登录和注册流程是否依然正常工作。