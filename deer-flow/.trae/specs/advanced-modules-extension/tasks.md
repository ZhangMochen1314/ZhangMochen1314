# Tasks

- [x] Task 1: 研读之前分析提取出的 `statspai/matching` 模块（匹配方法）的 API 签名和数据格式约束，开发 `DeepResValue-Matching` 技能。
  - [x] SubTask 1.1: 创建 `skills/custom/DeepResValue-Matching/SKILL.md`，并在顶部注入严格的意图澄清和二元处理变量 `treat` 预检机制。
  - [x] SubTask 1.2: 明确 `from statspai.matching.match import match` 的 API 调用，规定输出匹配前后的协变量平衡性图表。
- [x] Task 2: 研读之前分析提取出的 `statspai/dml` 模块（双重机器学习）的 API 签名和数据格式约束，开发 `DeepResValue-DML` 技能。
  - [x] SubTask 2.1: 创建 `skills/custom/DeepResValue-DML/SKILL.md`，并在顶部注入处理变量 `treat` 与高维控制变量 `covariates` 的意图澄清预检。
  - [x] SubTask 2.2: 明确 `from statspai.dml.double_ml import dml` 的 API 调用，规定根据处理变量是否二元自动选择 `plr` 或 `irm`，并规定使用默认的梯度提升树或随机森林作为底层的机器学习估计器。
- [x] Task 3: 在以上所有新技能中，严格遵守并植入 `SKILLS_ITERATION_LOG.md` 记录的 `set_theme('academic')` 全局可视化规范和 `REMEDIATIONS` 自修复机制。

# Task Dependencies
- [Task 1] 和 [Task 2] 可以独立并行开发。
- [Task 3] 必须作为 [Task 1] 和 [Task 2] 内部验证的共同约束。