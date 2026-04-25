# Tasks

- [x] Task 1: 开发 `DeepResValue-TimeSeries` 技能。基于 `statspai.timeseries` 模块，提取 VAR, ARIMA, Local Projections 等 API 签名。
  - [x] SubTask 1.1: 创建 `skills/custom/DeepResValue-TimeSeries/SKILL.md`，并在顶部注入要求时间索引（如 DatetimeIndex）、滞后阶数等时序预检机制。
  - [x] SubTask 1.2: 明确 `from statspai.timeseries.var import var` 等 API 调用，规定必须输出脉冲响应函数 (IRF) 图。
- [x] Task 2: 开发 `DeepResValue-Diagnostics` 技能。基于 `statspai.diagnostics` 模块，提取 Sensemakr, E-value, Oster 边界等 API 签名。
  - [x] SubTask 2.1: 创建 `skills/custom/DeepResValue-Diagnostics/SKILL.md`，并在顶部注入要求提供核心处理变量及基准控制变量（benchmark controls）的预检机制。
  - [x] SubTask 2.2: 明确 `from statspai.diagnostics.sensemakr import sensemakr` 等 API 调用，规定输出敏感性等高线图。
- [x] Task 3: 开发 `DeepResValue-Epi` 技能。整合 `statspai.epi`, `statspai.longitudinal`, `statspai.survival` 和 `statspai.target_trial` 模块。
  - [x] SubTask 3.1: 创建 `skills/custom/DeepResValue-Epi/SKILL.md`，并在顶部注入关于生存状态 (event)、观察时间 (time) 以及二元干预 (treat) 的严格数据格式检查与意图澄清。
  - [x] SubTask 3.2: 明确 `target_trial.emulate`, `survival.aft.aft`, `longitudinal.analyze.analyze` 等前沿 API 的调用，以及 K-M 曲线/生存概率图的规范输出。
- [x] Task 4: 在以上所有新技能中，严格遵守并植入 `SKILLS_ITERATION_LOG.md` 记录的 `set_theme('academic')` 全局可视化规范和 `REMEDIATIONS` 自修复机制。

# Task Dependencies
- [Task 1], [Task 2], [Task 3] 可以独立并行开发。
- [Task 4] 必须作为内部验证的共同约束。