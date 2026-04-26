# Skills Redesign & Alignment Spec

## Goal
重构智能体后端技能，使其与当前前端 `Chat.tsx` 中的 8 个核心技能模块完全对应。
特别是对 **文献检索与综述** 进行重构：默认搜索 30 篇核心期刊（英文使用原生/联网，中文使用联网搜索知网/万方以保证真实性和原文链接），并且只输出结构化的 `.md` 格式（取消 HTML 生成），但保留原有的 `.md` 内容结构要求。
对于涉及 **数据分析** 的技能（数据清洗、DID分析、空间计量等），优先调用后端的 `StatsPAI` 库；仅在 `StatsPAI` 无法满足需求时，回退到让智能体自行编写 Python 代码执行分析的稳健机制。

## Target Skills (From Frontend `CORE_SKILLS`)
1. `lit-search` (文献检索) -> **DeepTrace-Literature-Search**
2. `lit-review` (文献综述) -> **DeepTrace-Literature-Review**
3. `data-collect` (数据搜集) -> **deeptrace-datacollector** (已存在，需微调)
4. `data-clean` (数据清洗) -> **DeepTrace-DataClean**
5. `modeling` (2026建模大赛指导) -> **DeepTrace-statmodel** (已存在，需微调)
6. `did-analysis` (DID分析) -> **DeepTrace-DID**
7. `sci-plot` (科研绘图) -> **DeepTrace-SciPlot**
8. `spatial` (空间计量) -> **DeepTrace-Spatial**

## Approach & Changes

### 1. 文献技能重构 (`DeepTrace-Literature`)
目前 `DeepTrace-Literature` 混合了检索和综述。为对应前端的 `lit-search` 和 `lit-review`，我们将原 `DeepTrace-Literature` 拆分并重构：
- **`DeepTrace-Literature-Search` (文献检索)**：
  - **核心逻辑**：英文文献借助原生搜索/API；中文文献强制调用联网搜索（获取知网、万方的真实题目、作者、摘要、原文链接）。
  - **数量与质量**：默认获取 **30篇**，优先选择**核心期刊**。
  - **输出**：不再生成 HTML。严格按照原先要求的结构化 Markdown 输出文献列表（带真实链接）。
- **`DeepTrace-Literature-Review` (文献综述)**：
  - **核心逻辑**：基于 `lit-search` 获取的文献列表（或用户上传的文献），撰写结构化学术综述报告。
  - **输出**：纯 Markdown（包含引言、主题分析、研究方法、展望、APA 格式参考文献）。

### 2. 数据分析类技能开发与 "StatsPAI First" 原则
前端新增了 `data-clean`, `did-analysis`, `sci-plot`, `spatial` 四个模块。
- **机制设计**：在这些新技能的 `SKILL.md` 的描述和系统提示词中，**强制要求**：
  1. **首选 StatsPAI**：必须优先使用 Python 导入 `statspai` 库中的相关模块（如 `from statspai.causal.did import ...`, `from statspai.spatial import ...`）来完成计算。
  2. **回退稳健机制 (Fallback)**：如果在调用 `StatsPAI` 时发现缺少功能或报错，智能体才被允许使用底层的 `pandas`, `statsmodels`, `linearmodels` 等自行编写 Python 代码完成任务。
- **创建新技能文件夹**：
  为每个模块创建对应的 `SKILL.md`，并在 `description` 中明确以上逻辑。

### 3. 已有技能微调
- **`deeptrace-datacollector`**：保持不变，对应 `data-collect`。
- **`DeepTrace-statmodel`**：保持不变，对应 `modeling`。

## Expected Outcome
在 `/workspace/deer-flow/skills/custom/` 目录下将包含 8 个技能文件夹。每个文件夹都有一个标准的 `SKILL.md`。后端的 LangGraph 智能体重启后，将能完美映射前端的所有卡片，并严格遵循“真实联网文献”、“仅 MD 输出”以及“StatsPAI 优先”的规则。