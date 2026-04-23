# Upgrade 15 Skills Template Spec

## Why
目前 `DeepResValue` 系列的 15 个涉及 `StatsPAI` 的实证分析技能尚未按照最新的 `SKILL_TEMPLATE.md` 进行规范化重构，尤其是缺乏或未独立出“0. 意图澄清与数据预检 (Data Validation & Clarification)”环节，这可能导致大模型在处理用户不完整数据时产生不可预期的报错。根据用户要求，除 `DeepResValue-StatModel` 外，其余 15 个涉及数据分析的技能均需升级。

## What Changes
- 将 15 个目标技能的 `SKILL.md` 文件统一按照 `/workspace/deer-flow/skills/custom/SKILL_TEMPLATE.md` 的规范进行重写和结构调整。
- 为所有目标技能添加或独立出 `## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】` 章节。
- 移除原来嵌套在核心任务内的陈旧预检条目，将原有内容平滑迁移到新模板的对应结构中。

## Impact
- Affected specs: 15个科研实证分析技能 (DataClean, BioMR, CausalML, Diagnostics, DID, DML, Epi, IV, Matching, Mediation, Panel, RD, Spatial, Synth, TimeSeries)
- Affected code:
  - `/workspace/deer-flow/skills/custom/DeepResValue-*/SKILL.md` (排除 DeepResValue-StatModel 和已重构的 DeepResValue-SciPlot)

## MODIFIED Requirements
### Requirement: 技能结构标准化
系统必须确保所有的核心分析技能提示词具有统一的结构规范，特别是强制大模型在执行任何计算前，进行沙盒探针检测和要素逼问，以大幅提高系统的鲁棒性和 Zero-shot 成功率。