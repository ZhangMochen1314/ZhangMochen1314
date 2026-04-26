# DeepResValue Skill Renaming & Splitting Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一重命名所有后端技能为 `DeepResValue-*` 系列，修改对应 `SKILL.md` 的内容，并将混合的 `DeepTrace-Literature` 技能正式拆分为 `DeepResValue-Literature-Search` 和 `DeepResValue-Literature-Review`。

**Architecture:**
1. **Rename Directories & SKILL.md names**:
   - `DeepTrace-Literature` -> 拆分并重命名为 `DeepResValue-Literature-Search` 和 `DeepResValue-Literature-Review`。
   - `deeptrace-datacollector` -> 重命名为 `DeepResValue-DataCollector`。
   - `DeepTrace-DataClean` -> 重命名为 `DeepResValue-DataClean`。
   - `DeepTrace-statmodel` -> 重命名为 `DeepResValue-StatModel`。
   - `DeepTrace-DID` -> 重命名为 `DeepResValue-DID`。
   - `DeepTrace-SciPlot` -> 重命名为 `DeepResValue-SciPlot`。
   - `DeepTrace-Spatial` -> 重命名为 `DeepResValue-Spatial`。
2. **Update Content**:
   使用 `SearchReplace` 批量修改各技能目录下的 `SKILL.md`，将 `name:` 字段以及正文中的旧前缀替换为新的 `DeepResValue-` 前缀。

**Tech Stack:** Bash (mv, sed, grep), Markdown

---

### Task 1: Rename Existing Skills (Except Literature)

**Files:**
- Move directories in `/workspace/deer-flow/skills/custom/`
- Modify `SKILL.md` in each directory.

- [ ] **Step 1: Rename Directories**
```bash
cd /workspace/deer-flow/skills/custom
mv deeptrace-datacollector DeepResValue-DataCollector
mv DeepTrace-DataClean DeepResValue-DataClean
mv DeepTrace-statmodel DeepResValue-StatModel
mv DeepTrace-DID DeepResValue-DID
mv DeepTrace-SciPlot DeepResValue-SciPlot
mv DeepTrace-Spatial DeepResValue-Spatial
```

- [ ] **Step 2: Update DataCollector SKILL.md**
```bash
sed -i 's/name: deeptrace-datacollector/name: DeepResValue-DataCollector/g' /workspace/deer-flow/skills/custom/DeepResValue-DataCollector/SKILL.md
```

- [ ] **Step 3: Update DataClean SKILL.md**
```bash
sed -i 's/name: DeepTrace-DataClean/name: DeepResValue-DataClean/g' /workspace/deer-flow/skills/custom/DeepResValue-DataClean/SKILL.md
sed -i 's/DeepTrace-DataClean/DeepResValue-DataClean/g' /workspace/deer-flow/skills/custom/DeepResValue-DataClean/SKILL.md
```

- [ ] **Step 4: Update StatModel SKILL.md**
```bash
sed -i 's/name: DeepTrace-statmodel/name: DeepResValue-StatModel/g' /workspace/deer-flow/skills/custom/DeepResValue-StatModel/SKILL.md
sed -i 's/DeepTrace-statmodel/DeepResValue-StatModel/g' /workspace/deer-flow/skills/custom/DeepResValue-StatModel/SKILL.md
sed -i 's/DeepTrace-StatModel/DeepResValue-StatModel/g' /workspace/deer-flow/skills/custom/DeepResValue-StatModel/SKILL.md
```

- [ ] **Step 5: Update DID SKILL.md**
```bash
sed -i 's/name: DeepTrace-DID/name: DeepResValue-DID/g' /workspace/deer-flow/skills/custom/DeepResValue-DID/SKILL.md
sed -i 's/DeepTrace-DID/DeepResValue-DID/g' /workspace/deer-flow/skills/custom/DeepResValue-DID/SKILL.md
```

- [ ] **Step 6: Update SciPlot SKILL.md**
```bash
sed -i 's/name: DeepTrace-SciPlot/name: DeepResValue-SciPlot/g' /workspace/deer-flow/skills/custom/DeepResValue-SciPlot/SKILL.md
sed -i 's/DeepTrace-SciPlot/DeepResValue-SciPlot/g' /workspace/deer-flow/skills/custom/DeepResValue-SciPlot/SKILL.md
```

- [ ] **Step 7: Update Spatial SKILL.md**
```bash
sed -i 's/name: DeepTrace-Spatial/name: DeepResValue-Spatial/g' /workspace/deer-flow/skills/custom/DeepResValue-Spatial/SKILL.md
sed -i 's/DeepTrace-Spatial/DeepResValue-Spatial/g' /workspace/deer-flow/skills/custom/DeepResValue-Spatial/SKILL.md
```

---

### Task 2: Split and Rename Literature Skills

**Files:**
- Move: `DeepTrace-Literature` -> `DeepResValue-Literature-Search` and `DeepResValue-Literature-Review`
- Create `SKILL.md` for each.

- [ ] **Step 1: Create new directories**
```bash
cd /workspace/deer-flow/skills/custom
mv DeepTrace-Literature DeepResValue-Literature-Search
mkdir -p DeepResValue-Literature-Review
```

- [ ] **Step 2: Update Literature-Search SKILL.md**
```bash
cat << 'EOF' > /workspace/deer-flow/skills/custom/DeepResValue-Literature-Search/SKILL.md
---
name: DeepResValue-Literature-Search
description: 文献检索模块。默认通过真实联网搜索获取30篇中英文核心期刊文献（含真实链接和摘要），仅输出结构化Markdown文献列表。不进行长篇综述撰写。
dependency:
  python:
    - requests
---

# DeepResValue-Literature-Search 文献检索

## 核心任务与强制规则
1. **文献数量与质量**：默认且必须搜集 **30篇** 相关文献，**优先选择核心期刊**（中文如CSSCI、北大核心，英文如SCI/SSCI）。
2. **检索方式**：
   - 英文文献：优先使用系统原生搜索工具。
   - 中文文献：**强制使用联网搜索工具** 访问知网(CNKI)、万方等数据库的公开页面，以获取真实的题目、作者、摘要和**真实的原文链接/DOI**。
   - **禁止捏造**：所有文献必须是真实存在的，禁止大模型自行编造标题或摘要。
3. **输出格式**：仅输出带序号和摘要的 Markdown 格式文献列表，供后续综述或用户直接阅读。
EOF
```

- [ ] **Step 3: Create Literature-Review SKILL.md**
```bash
cat << 'EOF' > /workspace/deer-flow/skills/custom/DeepResValue-Literature-Review/SKILL.md
---
name: DeepResValue-Literature-Review
description: 文献综述模块。基于已有文献列表或用户上传的文献，自动生成结构化的Markdown文献综述报告。不包含网络检索行为，仅做文字梳理和分析。
---

# DeepResValue-Literature-Review 文献综述

## 核心任务与强制规则
1. **综述来源**：必须基于前置技能（如 DeepResValue-Literature-Search）提取的真实文献或用户上传的文献进行综述。
2. **禁止捏造**：严禁在综述中虚构文献。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**，绝对不生成任何 HTML 代码。

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

---

### Task 3: Commit and Restart Backend

- [ ] **Step 1: Commit new skills**
```bash
git add /workspace/deer-flow/skills/custom
git commit -m "feat: standardize skill names to DeepResValue-* prefix and split literature skills"
```

- [ ] **Step 2: Restart LangGraph Agent to load new skills**
```bash
cd /workspace/deer-flow
make stop || true
make dev-daemon
```