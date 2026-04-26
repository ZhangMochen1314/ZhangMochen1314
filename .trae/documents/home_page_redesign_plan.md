# DeepResValue 落地页重构计划 (Home Page Redesign Plan)

**目标:** 
根据用户提供的最新文案 (`/workspace/DeepResValue落地页文案.md`)，运用 `frontend-design`, `brand-guidelines`, `frontend-skill`, 和 `algorithmic-art` 技能，重新设计并实现一个极具视觉冲击力、高转化率且符合高端 SaaS 审美的落地页。

**核心设计理念 (Visual & Interaction Thesis):**
- **视觉定调 (Visual Thesis)**: 深空数据流 (Dark Glassmorphism) 结合极简的版式设计。背景采用 p5.js 动态数据星象图（已有），通过高斯模糊、微透视卡片、发光边框和 Anthropic 品牌色（橙红、清蓝、森绿）构建高级感与专业度。
- **内容层级 (Content Plan)**: 严格按照文案的逻辑进行模块化布局，避免信息堆砌。大量运用对比（传统代码 vs Vibe Coding）、图标墙和流程式排版，让大学生和科研人员能在 10 秒内 Get 到核心卖点。
- **交互动效 (Interaction Thesis)**: 使用 `framer-motion` 实现滚动触发 (Scroll-triggered) 的淡入上浮、代码块打字机效果、Hover 状态下的微发光与卡片上浮。不滥用动画，但关键转化点必须有吸睛的微交互。

## 当前状态分析
- `frontend/src/pages/Home.tsx` 目前包含了一个基于旧文案的落地页，具有 Hero 区、特色功能、定价区和页脚。
- 已实现了全局 AuthModal 和 `p5.js` 动态背景。
- 样式配置已支持 `Poppins` 和 `Lora` 字体。

## 改造步骤 (Proposed Changes)

### Task 1: 重构首屏 Hero 区 (Section 1)
- **文件**: `frontend/src/pages/Home.tsx`
- **操作**:
  - 主标题："用自然语言做数据分析"，副标题："告别代码，开口就能出结果"。
  - 使用 `Lora` 衬线字体渲染主标题，突出学术感。
  - 核心标签：展示 "🔥 Vibe Coding 新范式 | 🏆 国奖直达车 | 🎓 全流程覆盖"。
  - 震撼对比：设计一个并排的对比卡片或列表，展示“学Stata：2个月”与“说出需求：10秒”的强烈反差。
  - 行动按钮 (CTA) 保持现有“使用邀请码注册”触发 `AuthModal`。

### Task 2: 新增 Vibe Coding 新范式区 (Section 2)
- **文件**: `frontend/src/pages/Home.tsx`
- **操作**:
  - 采用双列布局 (Split-screen) 或对比卡片。
  - 左侧展示 Stata 传统代码（使用暗色代码块），右侧展示 DeepResValue 的自然语言对话框（类似微信或 ChatGPT 对话气泡样式）。
  - 下方使用横向卡片或表格列出“优势总结”和“支持的翻译能力”。

### Task 3: 新增“不需要再学的工具”与“竞赛专区” (Section 3 & 4)
- **文件**: `frontend/src/pages/Home.tsx`
- **操作**:
  - **工具墙**: 设计一个划掉的工具墙（Stata, SPSS, Python 等），使用带删除线或透明度降低的 Logo/文字，强调替代性。
  - **适用场景**: 用极简的列表或网格展示“你想要的 -> 你说的 -> AI执行的”。
  - **竞赛专区**: 设计为“荣誉/奖杯”主题区块。使用深色背景+金色/品牌色点缀。展示三大成功案例（采用用户评价卡片 Testimonial Cards 形式）。

### Task 4: 新增“全流程能力”与“信任背书” (Section 5 & 10)
- **文件**: `frontend/src/pages/Home.tsx`
- **操作**:
  - **全流程能力**: 设计一个横向的步骤条或时间轴 (Step/Timeline)，从①研究设计 到 ⑤论文撰写。鼠标 Hover 或点击时展示对应的自然语言交互示例。
  - **信任背书**: 将技术认证和用户数据 (已服务1000+等) 设计为数据统计条 (Stat Strips)，放置在重要区块之间的过渡带。

### Task 5: 优化“邀请机制”与“校园大使”，重构 CTA & Footer (Section 6, 7, 8, 9)
- **文件**: `frontend/src/pages/Home.tsx`
- **操作**:
  - 将原先的“算力积分”计费区替换或融合为“邀请奖励机制”与“校园大使招募”。
  - 设计积分商城卡片和大使权益矩阵。
  - **底部 CTA**: 设计一个极具冲击力的全屏宽度区块，主标题："别再学代码了，直接用母语做研究"，包含注册按钮和微信咨询提示。
  - **Footer**: 包含品牌信息，突出微信客服 `MoChen11-20`。

## 假设与决策 (Assumptions & Decisions)
- 保持现有的 `DynamicBackground.tsx` 和 `AuthModal.tsx` 不变，仅在 `Home.tsx` 中大幅重构页面结构与文案。
- 去除现有的纯“定价表”区域，转而使用“积分商城”和“邀请奖励”机制，因为新文案没有明确提供现金购买的套餐列表。
- 为了保持代码的整洁和可维护性，巨大的页面会被拆分为多个逻辑区块的注释段落，但均写在 `Home.tsx` 中。

## 验证步骤 (Verification)
- 运行 `make dev` 确保前端编译通过无报错。
- 在浏览器中滚动页面，验证所有文案是否正确替换，动画是否流畅。
- 确认移动端响应式布局在多列对比、时间轴等复杂组件下是否正常。
- 确认“注册”按钮是否依然能成功唤起 `AuthModal`。
