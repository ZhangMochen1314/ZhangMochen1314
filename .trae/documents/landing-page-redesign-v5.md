# DeepResValue 落地页深度重构实施计划

## 1. 摘要 (Summary)
根据用户提供的 `DeepResValue落地页文案.md`，彻底重构当前的落地页 (`Home.tsx`)。设计将严格遵循 `brand-guidelines`（品牌字体与色彩）、`frontend-skill`（高阶排版与留白）和 `frontend-design`（华丽的动态特效与视觉冲击力），同时保留已实现的 `AlgorithmicBackground`（算法艺术背景）和 `AuthModal`（鉴权弹窗）。目标是打造一个极具吸引力、直击大学生痛点（国奖、实证分析、免写代码）的高转化率学术科技产品落地页。

## 2. 当前状态分析 (Current State Analysis)
*   当前的 `Home.tsx` 包含了早期的 Hero 区、基础功能网格和定价卡片，代码集中在一个文件（约 280 行）。
*   新的文案包含了 10 个逻辑严密的叙事区块（从痛点引入到具体场景，再到转化与信任背书），内容量大幅增加。如果继续写在一个文件中，将导致代码臃肿、难以维护。
*   已经具备了优秀的底层视觉元素（`AlgorithmicBackground`）和转化交互（`AuthModal`），只需做好内容层面的“排兵布阵”和“视觉动效”。

## 3. 拟议变更 (Proposed Changes)

为了保证代码的可读性和可维护性，我们将采用组件化的方式拆分落地页。

**步骤 1：创建组件目录**
*   在 `frontend/src/components/` 下创建 `landing` 目录，用于存放落地页的各个独立区块。

**步骤 2：开发独立的视觉区块组件 (使用 Tailwind + Framer Motion)**
所有的组件都将使用 `framer-motion` 的 `whileInView` 来实现滚动触发的华丽入场动效，并严格使用 `Poppins`（标题）和 `Lora`（正文）字体。

*   **`HeroSection.tsx` (对应文案一、十)**：首屏震撼冲击。超大加粗标题，品牌色高亮“自然语言”，展示痛点对比表格（或卡片化呈现），集成信任背书数据（已服务用户 1000+ 等）。
*   **`VibeCodingSection.tsx` (对应文案二)**：左右分屏或上下滚动的代码对比视觉。左侧展示繁琐的 Stata 代码，右侧展示极简的对话 UI 界面（Mockup），突出“翻译”能力。
*   **`ToolsSection.tsx` (对应文案三)**：使用品牌强调色（如红色/橙色 `#d97757` 打叉，绿色 `#788c5d` 勾选），展示不再需要学习的工具墙，并用优雅的列表展示适用场景。
*   **`CompetitionSection.tsx` (对应文案四)**：专门针对“统计建模国奖”、“正大杯”的荣誉展示区。使用卡片或时间线流展示成功案例，配以奖杯等高优图标，刺激大学生的成就动机。
*   **`WorkflowSection.tsx` (对应文案五)**：全流程能力展示。使用横向或纵向的连接步骤（Step-by-Step）动画，展示从研究设计到论文撰写的 5 个环节的自然语言交互。
*   **`RewardsSection.tsx` (对应文案六、七)**：整合邀请奖励与校园大使招募。高亮展示“100积分/50积分”的双向奖励机制和微信 `MoChen11-20` 的转化入口。
*   **`FeaturesSection.tsx` (对应文案八)**：为什么选择 DeepResValue。展示三大核心优势，特别是国产大模型 DeepSeek V4 Pro 的底层支撑和结果的可复现性。
*   **`CtaSection.tsx` (对应文案九)**：底部强转化区。巨大号召性标题，配合大尺寸的深色/品牌色按钮，再次呼出 `AuthModal`。

**步骤 3：重构 `Home.tsx`**
*   清理 `Home.tsx` 中旧的硬编码内容。
*   按顺序引入上述所有 `landing` 子组件。
*   将 `AlgorithmicBackground` 作为全局底层，确保滚动时背景的动态粒子效果连贯。
*   将 `handleCTA`（呼出 `AuthModal` 的逻辑）作为 prop 传递给需要的组件（如 Hero 和 CTA 区块）。

## 4. 假设与设计决策 (Assumptions & Decisions)
*   **视觉风格 (Aesthetic)**：采用“Editorial/Magazine Academic”（学术杂志风）混搭“Glassmorphism”（毛玻璃）。避免堆砌无意义的卡片（No generic cards），多使用大面积留白、分割线、不对称排版和精美的排版层次。
*   **品牌规范 (Brand Guidelines)**：
    *   主文本：`#141413`
    *   浅色背景：`#faf9f5`
    *   主强调色（橙色）：`#d97757`
    *   副强调色（蓝色）：`#6a9bcc`
    *   辅助强调色（绿色）：`#788c5d`
*   **动效 (Motion)**：不滥用乱跳的动画。主要使用从下至上的优雅淡入（`y: 20, opacity: 0` -> `y: 0, opacity: 1`）、子元素的交错显示（`staggerChildren`），以及重要数据的滚动计数效果。

## 5. 验证步骤 (Verification)
*   所有组件开发完成后，通过 `npm run dev` 启动前端。
*   在浏览器中滚动查看，确认所有区块顺序符合文案逻辑。
*   确认 `Poppins` 和 `Lora` 字体生效，品牌颜色准确。
*   确认 Framer Motion 滚动动画流畅且无卡顿。
*   点击各处的“免费注册/进入研究室”按钮，确保能正确呼出原有的 AuthModal。
