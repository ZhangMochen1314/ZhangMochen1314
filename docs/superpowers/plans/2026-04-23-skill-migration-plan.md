# DeepTrace Data Collector Skill Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `data-collection` 技能移动到 DeepResValue (原 deerflow) 标准的技能路径下，并确保它符合技能要求，能被智能体正确识别使用。

**Architecture:**
- **Path Migration:** DeepResValue 的技能默认路径为 `deer-flow/skills` (在配置中可被加载)。我们将 `data-collection/projects/deeptrace-datacollector` 移动到 `/workspace/deer-flow/skills/custom/deeptrace-datacollector`。
- **SKILL.md Refactoring:** 现有的 `SKILL.md` 的 YAML frontmatter 中定义了依赖项 (`dependency: python: [...]`)。我们需要确保这个格式和描述符合系统的识别标准。
- **Cleanup:** 将其余的 `data-collection` 相关文件 (如 `.coze`, `requirements.txt`) 也一并归档或迁移到技能目录下，清理根目录的 `data-collection`。

**Tech Stack:** Bash

---

### Task 1: Migrate the Skill Directory

**Files:**
- Move: `/workspace/data-collection/projects/deeptrace-datacollector` -> `/workspace/deer-flow/skills/custom/deeptrace-datacollector`
- Move: `requirements.txt` if necessary.

- [ ] **Step 1: Move the skill folder**
```bash
mkdir -p /workspace/deer-flow/skills/custom/
mv /workspace/data-collection/projects/deeptrace-datacollector /workspace/deer-flow/skills/custom/
```

- [ ] **Step 2: Clean up the old directory**
```bash
# Archive the old data-collection folder or remove it if empty
rm -rf /workspace/data-collection
```

---

### Task 2: Validate and Update SKILL.md

**Files:**
- Check/Modify: `/workspace/deer-flow/skills/custom/deeptrace-datacollector/SKILL.md`

- [ ] **Step 1: Check SKILL.md frontmatter**
The current `SKILL.md` has the following frontmatter:
```yaml
---
name: deeptrace-datacollector
description: DeepTrace数据搜集技能：从外部数据源（CSMAR、Wind、统计局等）搜集实证分析所需数据，支持宏观经济、金融、企业等多类型数据获取
dependency:
  python:
    - pandas>=1.5.0
    - requests>=2.28.0
    - openpyxl>=3.0.0
    - statsmodels>=0.13.0
  system:
    - mkdir -p logs
---
```
这个格式是符合标准的 DeerFlow 技能格式的 (支持 `name`, `description`, `dependency`)。我们需要确认是否需要将其中的 `dependency.system` 命令修改为更通用的形式，或者保持原样。目前格式是兼容的。无需做大规模的重构，只需确保目录结构正确即可。

- [ ] **Step 2: Install Python dependencies in the backend**
```bash
cd /workspace/deer-flow/backend
uv pip install pandas>=1.5.0 requests>=2.28.0 openpyxl>=3.0.0 statsmodels>=0.13.0
```

---

### Task 3: Reload Configuration and Verify

- [ ] **Step 1: Restart the backend to load new skills**
```bash
cd /workspace/deer-flow
make stop || true
make dev-daemon
```

- [ ] **Step 2: Commit the skill migration**
```bash
git add /workspace/deer-flow/skills /workspace/data-collection
git commit -m "feat: migrate deeptrace-datacollector skill to deer-flow/skills/custom"
```