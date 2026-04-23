# DeepResValue Skills Alignment & Development Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构原文献技能并补充开发前端所需的其余数据分析技能，确保它们严格输出 `.md`、优先使用 `StatsPAI` 并在必要时回退至自动编程，且中文文献默认抓取知网等真实数据。

**Architecture:**
- **Literature Refactoring:** 移除原有的 HTML 生成逻辑，只保留 Markdown。将中文文献获取强制绑定联网搜索以获取真实链接和摘要，默认搜集 30 篇核心期刊文献。
- **New Skills Development:** 新建 `DeepTrace-DataClean`, `DeepTrace-DID`, `DeepTrace-SciPlot`, `DeepTrace-Spatial` 的技能目录与 `SKILL.md`。每个技能在系统描述中显式要求 "优先导入 StatsPAI，不足时 fallback 为原生 Python"。

**Tech Stack:** Python (LangGraph/StatsPAI), Markdown

---

### Task 1: Refactor Literature Search & Review Skills

**Files:**
- Modify/Create: `/workspace/deer-flow/skills/custom/DeepTrace-Literature/SKILL.md` (Update existing or split into Search and Review if needed; we will update the existing one to handle both via updated prompts).
- We will rewrite the `SKILL.md` entirely to drop HTML references, enforce 30 core journals, and enforce MD-only output.

- [ ] **Step 1: Rewrite DeepTrace-Literature SKILL.md**
```bash
cat << 'EOF' > /workspace/deer-flow/skills/custom/DeepTrace-Literature/SKILL.md
---
name: DeepTrace-Literature
description: 文献检索与文献综述模块。根据用户主题，默认通过真实联网搜索获取30篇中英文核心期刊文献（含真实链接），并自动生成结构化的Markdown文献综述报告。不生成HTML。
dependency:
  python:
    - requests
---

# DeepTrace-Literature 文献检索与综述

## 核心任务与强制规则
1. **文献数量与质量**：默认且必须搜集 **30篇** 相关文献，**优先选择核心期刊**（中文如CSSCI、北大核心，英文如SCI/SSCI）。
2. **检索方式**：
   - 英文文献：优先使用系统原生搜索工具。
   - 中文文献：**强制使用联网搜索工具** 访问知网(CNKI)、万方等数据库的公开页面，以获取真实的题目、作者、摘要和**真实的原文链接/DOI**。
   - **禁止捏造**：所有文献必须是真实存在的，禁止大模型自行编造标题或摘要。
3. **唯一输出格式**：**仅输出结构化的 Markdown (.md) 报告**，绝对不生成任何 HTML 代码。

## 操作流程
1. **理解需求**：提取用户研究主题的核心关键词。
2. **执行检索**：调用系统提供的联网/搜索工具，批量收集不少于30篇文献。提取字段必须包括：[标题, 作者, 期刊, 年份, 摘要(核心), 链接]。
3. **撰写综述 (Markdown)**：
   - 使用学术论文标准的“总-分-总”结构。
   - 正文引用采用数字标注法，如 `[1][2]`。
   - 结尾按 APA 格式列出所有 30 篇参考文献。

## Markdown 报告模板
```markdown
# [研究主题]文献综述报告

## 摘要
[200-300字的概括]

## 一、引言
### 1.1 研究背景
### 1.2 检索策略与文献概况

## 二、核心研究主题综述
### 2.1 [子主题一]
[正文论述...引用示例[1][2]]
### 2.2 [子主题二]
[正文论述...引用示例[3][4]]

## 三、研究方法与不足
### 3.1 常用研究方法
### 3.2 现有文献的不足与展望

## 参考文献
[1] 作者. (年份). 标题. 期刊, 卷(期), 页码. [原文链接]
[2] ...
\```
EOF
```

- [ ] **Step 2: Remove old HTML template assets**
```bash
rm -rf /workspace/deer-flow/skills/custom/DeepTrace-Literature/assets/report_template.html
```

---

### Task 2: Develop Data Clean Skill

**Files:**
- Create: `/workspace/deer-flow/skills/custom/DeepTrace-DataClean/SKILL.md`

- [ ] **Step 1: Create DataClean SKILL.md**
```bash
mkdir -p /workspace/deer-flow/skills/custom/DeepTrace-DataClean
cat << 'EOF' > /workspace/deer-flow/skills/custom/DeepTrace-DataClean/SKILL.md
---
name: DeepTrace-DataClean
description: 数据清洗技能。处理缺失值、异常值和缩尾。强制优先使用 StatsPAI 库进行处理，无法满足时由智能体自行编写 Python 脚本处理。
dependency:
  python:
    - pandas
    - numpy
---

# DeepTrace-DataClean 数据清洗

## 任务目标
为科研面板数据提供自动化的缺失值填补、异常值剔除、Winsorize缩尾处理以及标准化处理。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成数据清洗 Python 代码时，**必须优先尝试导入并使用 `statspai` 库中的数据处理模块**。
2. **Fallback 稳健机制**：如果在调用 `StatsPAI` 时报错或发现该库暂未支持特定的清洗功能，智能体必须**自动回退**，自行使用原生 `pandas`、`numpy` 编写稳健的数据处理代码（如 `df.fillna()`, `df.clip()` 等）。
3. **执行与输出**：代码编写完成后直接在当前沙盒执行，展示清洗前后的统计摘要变化，并输出清洗后的 `.csv` 文件供用户下载。
EOF
```

---

### Task 3: Develop DID Analysis Skill

**Files:**
- Create: `/workspace/deer-flow/skills/custom/DeepTrace-DID/SKILL.md`

- [ ] **Step 1: Create DID SKILL.md**
```bash
mkdir -p /workspace/deer-flow/skills/custom/DeepTrace-DID
cat << 'EOF' > /workspace/deer-flow/skills/custom/DeepTrace-DID/SKILL.md
---
name: DeepTrace-DID
description: 双重差分(DID)分析技能。支持平行趋势检验与倾向得分匹配(PSM)。强制优先使用 StatsPAI 库，无法满足时回退到 Python 脚本。
dependency:
  python:
    - pandas
    - statsmodels
    - linearmodels
---

# DeepTrace-DID 双重差分分析

## 任务目标
进行因果推断中的 DID 分析，包含基准回归、平行趋势检验、安慰剂检验及 PSM-DID。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：编写模型代码时，**必须优先使用 `statspai.causal.did`** 等相关模块完成因果推断的估计与检验。
2. **Fallback 稳健机制**：如果 `StatsPAI` 调用失败，智能体必须**自动回退**，使用 `linearmodels.PanelOLS` 或 `statsmodels` 编写原生的双向固定效应 DID 回归代码。
3. **输出**：生成学术标准的回归结果表格（Markdown），并绘制平行趋势检验图（保存为图片）。
EOF
```

---

### Task 4: Develop Sci-Plot Skill

**Files:**
- Create: `/workspace/deer-flow/skills/custom/DeepTrace-SciPlot/SKILL.md`

- [ ] **Step 1: Create SciPlot SKILL.md**
```bash
mkdir -p /workspace/deer-flow/skills/custom/DeepTrace-SciPlot
cat << 'EOF' > /workspace/deer-flow/skills/custom/DeepTrace-SciPlot/SKILL.md
---
name: DeepTrace-SciPlot
description: 科研绘图技能。生成学术论文级高清统计图表。强制优先使用 StatsPAI 库，无法满足时使用 matplotlib/seaborn。
dependency:
  python:
    - matplotlib
    - seaborn
---

# DeepTrace-SciPlot 科研绘图

## 任务目标
一键生成符合国内外核心期刊规范的高清统计图表（散点图、折线图、热力图、箱线图等）。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：优先检查 `statspai` 库中是否有对应的可视化封装函数并调用。
2. **Fallback 稳健机制**：若无，使用 `matplotlib` 和 `seaborn` 进行绘制。要求：设置高分辨率 (dpi=300)、学术字体、去除无用的边框、使用色盲友好的学术配色。
3. **输出**：在沙盒中执行绘图脚本，保存图片并向用户展示。
EOF
```

---

### Task 5: Develop Spatial Econometrics Skill

**Files:**
- Create: `/workspace/deer-flow/skills/custom/DeepTrace-Spatial/SKILL.md`

- [ ] **Step 1: Create Spatial SKILL.md**
```bash
mkdir -p /workspace/deer-flow/skills/custom/DeepTrace-Spatial
cat << 'EOF' > /workspace/deer-flow/skills/custom/DeepTrace-Spatial/SKILL.md
---
name: DeepTrace-Spatial
description: 空间计量经济学技能。计算空间权重矩阵并估计 SDM/SAR/SEM 模型。强制优先使用 StatsPAI，无法满足时回退。
dependency:
  python:
    - pandas
    - geopandas
    - libpysal
    - spreg
---

# DeepTrace-Spatial 空间计量

## 任务目标
计算地理距离/经济距离空间权重矩阵，并执行空间自回归模型(SAR)、空间误差模型(SEM)及空间杜宾模型(SDM)的估计。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在构建权重矩阵和估计模型时，**必须优先调用 `statspai.spatial`** 模块。
2. **Fallback 稳健机制**：如果 `StatsPAI` 暂未涵盖所需空间计量功能或发生异常，智能体必须**自动回退**，利用原生的 `libpysal` 和 `spreg` 库编写 Python 脚本完成估计。
3. **输出**：生成莫兰指数(Moran's I)检验结果、回归系数表及直接/间接效应分解，输出为 Markdown 格式。
EOF
```

---

### Task 6: Commit and Restart Backend

- [ ] **Step 1: Commit new skills**
```bash
git add /workspace/deer-flow/skills/custom
git commit -m "feat: complete skill alignment, refactor literature for real-network & MD, add statspai-first mechanism for analysis skills"
```

- [ ] **Step 2: Restart LangGraph Agent to load new skills**
```bash
cd /workspace/deer-flow
make stop || true
make dev-daemon
```