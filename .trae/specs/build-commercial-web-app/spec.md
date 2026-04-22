# Build Commercial Web App MVP Spec

## Why
大学生在进行科研、论文写作及国家级竞赛（如全国大学生统计建模大赛、正大杯等）时面临数据分析门槛高、难以复现等痛点。目前系统后端的 DeerFlow 2.0 结合 StatsPAI 已经具备可复现自动化数据分析的专业能力。本项目阶段的目标是将这些能力封装为商业化网页应用，并引入基于“积分”的商业化计费模式，解决大学生的痛点并实现项目商业落地与部署。

## What Changes
- **扩展文件上传支持**：除了基础的 Excel/CSV，还需要支持学术界常用的 Word、PDF、PPT、dta (Stata)、sav (SPSS)、shp (GIS空间数据)、py、R、do (Stata脚本) 以及压缩包 (zip/rar) 等格式。限制单个文件不超过 50MB，单次最多上传 5 个文件。
- **动态积分计费模型**：设计一套动态积分扣减规则，计费维度包含：数据集大小、Python执行时长、数据分析复杂度、以及是否生成图片/图表。
- **高品质学术 UI 与渲染 (Frontend Design)**：
  - 采用极简、严谨的学术风格 UI（象牙白/科研蓝），摒弃廉价的 AI 生成感。
  - **强大的渲染能力**：前端需原生支持渲染数据图片、数学公式（LaTeX/KaTeX）。
  - **三线表渲染**：前端 Markdown 表格必须通过自定义 CSS 渲染为标准的学术“三线表”（顶部粗线、表头下细线、底部粗线），以满足学术报告的直接复制需求。
- **重构产品首页**：针对大学生群体优化文案与 UI，突出“科研辅助”、“国家级竞赛指导”、“可复现分析”等核心竞争力。

## Impact
- Affected specs: 商业化落地、积分消费模式、文件处理管道、富文本渲染。
- Affected code:
  - 核心页面：`src/pages/Home.tsx`, `src/pages/Chat.tsx`, `src/pages/Datasets.tsx`
  - 样式与渲染：`src/index.css` (三线表样式), Markdown 渲染组件配置 (remark-gfm, rehype-katex)
  - 业务逻辑：上传校验逻辑 (50MB/5个限制)、动态积分计算逻辑。

## ADDED Requirements
### Requirement: 多格式文件上传与校验
The system SHALL provide 针对学术常用数据与文档格式的上传通道，并严格执行大小与数量限制。

#### Scenario: 用户上传多个大文件
- **WHEN** 用户尝试上传 6 个文件，或其中某个文件超过 50MB
- **THEN** 前端立刻拦截并给予明确的错误提示（“单次最多上传5个文件”或“单个文件大小不能超过50MB”）。

### Requirement: 动态积分消费机制
The system SHALL provide 基于多维度的动态积分计费机制。

#### Scenario: 复杂数据分析扣费
- **WHEN** 用户上传了 20MB 的数据集，并要求进行包含图表生成的复杂异质性 DID 分析
- **THEN** 系统根据规则（基础分 + 容量分[20MB] + 复杂度分[高级分析] + 绘图分 + 执行耗时分）计算总消耗积分，并在执行前后向用户展示和扣除。

### Requirement: 学术级富文本与三线表渲染
The system SHALL provide 类似学术论文标准的结果展示。

#### Scenario: 渲染回归结果
- **WHEN** StatsPAI 返回包含 LaTeX 公式和回归系数表格的 Markdown 结果
- **THEN** 前端将其渲染为标准的数学公式和无垂直边框的学术三线表。
