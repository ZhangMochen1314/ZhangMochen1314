# Tasks

- [x] Task 1: 编写 `DeepResValue-IV` (工具变量) 技能的 `SKILL.md`，明确内生性检验与估计函数（如 `ivdml`, `npiv`），明确弱工具变量检验的 API 签名。
- [x] Task 2: 编写 `DeepResValue-Mediation` (机制检验) 技能的 `SKILL.md`，明确因果中介分析（如 `mediate`, `four_way_decomposition`）的 API 签名和参数。
- [x] Task 3: 编写 `DeepResValue-Panel` (面板回归) 技能的 `SKILL.md`，明确高维固定效应面板回归（如 `feols`, `interactive_fe`）的参数和 Hausman 检验方法。
- [x] Task 4: 编写 `DeepResValue-BioMR` (生信分析/孟德尔随机化) 技能的 `SKILL.md`，明确 GWAS 汇总数据输入（如 `mr_ivw`, `mr_egger`），异质性/多效性检验，以及可视化方法。
- [x] Task 5: 在 `skills/custom/` 目录下创建一个统一的 `SKILL_TEMPLATE.md`，固化“StatsPAI 优先原则”、“Fallback 机制”、“自修复机制”以及“专业绘图输出”的标准范式。
- [x] Task 6: 优化智能体 Prompt，指导大模型在处理数据时优先调用 `statspai` 返回对象的 `.summary()` 或 `.to_markdown()` 生成结果，以及 `.plot()` 生成标准化图片，统一输出格式。

# Task Dependencies
- [Task 1], [Task 2], [Task 3], [Task 4] 依赖于 [Task 5]（需要参考标准模板进行开发）。
- [Task 6] 依赖于上述所有技能配置的完成。