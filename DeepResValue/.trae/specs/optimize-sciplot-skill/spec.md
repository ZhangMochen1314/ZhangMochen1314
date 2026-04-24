# Optimize DeepResValue-SciPlot Skill Spec

## Why
当前 `DeepResValue-SciPlot` 技能目录下存在大量冗余的带时间戳的模板文件和评分 JSON 文件（位于 `best_templates/` 目录中），这不仅显得杂乱，还会导致上下文过载，干扰智能体的理解和应用。此外，该技能的 `SKILL.md` 文件需要适配最新定义的 `SKILL_TEMPLATE.md`，以确保行为规范的统一性和高效性。

## What Changes
- **清理文件环境**：删除 `best_templates/` 目录下所有带有时间戳的冗余 Python 脚本和 JSON 评分文件，仅保留每个图表类型的最佳基础模板。
- **重构技能提示词**：按照最新的 `SKILL_TEMPLATE.md` 规范，重写 `SKILL.md`，加入“意图澄清与数据预检”等强制环节，删除无用或过时的指令内容，使提示词保持干净和高信噪比。

## Impact
- Affected specs: 科研绘图技能 (DeepResValue-SciPlot)
- Affected code:
  - `/workspace/deer-flow/skills/custom/DeepResValue-SciPlot/best_templates/*`
  - `/workspace/deer-flow/skills/custom/DeepResValue-SciPlot/SKILL.md`

## MODIFIED Requirements
### Requirement: 优化科研绘图技能
系统必须提供一个干净、无冗余文件的科研绘图技能目录。技能的提示词文件必须高度结构化，包含明确的数据校验步骤、API调用规范以及错误修复机制，确保大模型能够无干扰地读取并准确应用该绘图技能。