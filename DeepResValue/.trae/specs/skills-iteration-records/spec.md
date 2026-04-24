# Skills Iteration and Empirical Analysis Spec

## Why
目前我们已经基于 `StatsPAI` 引擎开发了多个核心科研技能（如空间计量、DID、面板回归等），并且在开发过程中总结出了极其宝贵的迭代经验（从搭建骨架到注入前沿算法，再到完善防呆机制和底层数据格式约束）。为了保证未来智能体技能开发的高效性和规范性，我们需要将这一套迭代方法论沉淀为一个标准的 Markdown 记录文档。同时，`StatsPAI` 目录下还有大量未被开发的实证分析模块（如合成控制、断点回归、因果森林等），我们需要基于这个迭代经验，系统性地学习这些剩余模块，并开发出对应的实证分析技能，最终打造一个全能的科研智能体。

## What Changes
- **创建技能迭代经验文档**：在 `/workspace/deer-flow/.trae` 目录下创建 `SKILLS_ITERATION_LOG.md`，详细记录“四步走”的技能迭代法（确立首选原则 -> 注入精确 API -> 注入高级算法 -> 增加数据防呆预检）。
- **学习 StatsPAI 剩余模块**：基于迭代经验，研读 `/workspace/deer-flow/StatsPAI/src/statspai` 目录下的其他重要实证分析模块（如 `rd` 断点回归, `synth` 合成控制, `causal` 机器学习因果推断等）。
- **开发新的实证分析技能**：为新学习的模块创建或完善对应的 `SKILL.md`，并严格遵守迭代经验中的防呆机制和 API 签名要求。

## Impact
- Affected specs: 新增 `SKILLS_ITERATION_LOG.md`。
- Affected code: `/workspace/deer-flow/skills/custom/` 目录下的新实证分析技能配置。

## ADDED Requirements
### Requirement: 技能迭代经验沉淀
系统 SHALL 包含一个清晰的技能开发与迭代指南文档。
#### Scenario: 开发者开发新技能
- **WHEN** 开发者或智能体准备为系统添加新的数据分析技能时
- **THEN** 可以直接参考 `SKILLS_ITERATION_LOG.md`，确保新技能包含数据预检、API 精确调用和 Fallback 机制。

### Requirement: 扩充实证分析技能库
系统 SHALL 掌握更多的现代计量经济学实证分析方法。
#### Scenario: 用户请求复杂因果推断
- **WHEN** 用户要求进行“断点回归”或“合成控制”分析
- **THEN** 智能体能够主动询问断点位置或控制组信息，并准确调用 `statspai.rd` 或 `statspai.synth` 进行估计和专业绘图。