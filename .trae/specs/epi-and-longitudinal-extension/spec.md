# Epi and Longitudinal Modules Extension Spec

## Why
用户要求继续开发 `StatsPAI` 引擎中针对不同领域的“顶刊级”实证工具，其中包括时间序列分析 (Timeseries)、敏感性诊断 (Diagnostics) 以及涵盖流行病学、生存分析和目标试验模拟的纵向数据因果推断模块 (Epi & Longitudinal Data)。这四大模块将极大地扩充智能体在宏观经济、医学统计和公共卫生领域的实战能力。我们需要遵循之前沉淀的《技能深度迭代方法论》（数据预检 -> 精确 API -> 高级算法 -> 异常自愈），为这些模块开发相应的独立技能配置。

## What Changes
- **开发 `DeepResValue-TimeSeries` 技能**：基于 `statspai.timeseries` 模块，提供 VAR、ARIMA、协整检验及 Local Projections 功能。
- **开发 `DeepResValue-Diagnostics` 技能**：基于 `statspai.diagnostics` 模块，提供 Oster 边界、E-value 和 Sensemakr 等遗漏变量敏感性分析功能。
- **开发 `DeepResValue-Epi` 技能**：整合 `statspai.epi`, `statspai.longitudinal`, `statspai.survival` 和 `statspai.target_trial`，提供流行病学基础指标计算、AFT/Cox 生存分析、纵向动态干预评估以及纯观察性数据的目标试验模拟 (Target Trial Emulation)。
- 在以上技能中注入针对性的“意图澄清与数据预检”机制（如时序的频率检查、生存数据的事件截尾标识检查等）。

## Impact
- Affected specs: 扩展系统的跨学科实证分析技能库。
- Affected code:
  - 新增 `/workspace/deer-flow/skills/custom/DeepResValue-TimeSeries/SKILL.md`
  - 新增 `/workspace/deer-flow/skills/custom/DeepResValue-Diagnostics/SKILL.md`
  - 新增 `/workspace/deer-flow/skills/custom/DeepResValue-Epi/SKILL.md`

## ADDED Requirements
### Requirement: 时间序列分析 (TimeSeries) 技能
系统 SHALL 提供宏观数据的多变量时序建模与检验能力。
#### Scenario: 用户请求宏观时序分析
- **WHEN** 用户提供包含日期的宏观数据并要求跑 VAR 或局部投影
- **THEN** 智能体能够主动询问需要纳入哪些变量以及滞后阶数，并调用 `statspai.timeseries.var` 输出脉冲响应函数 (IRF) 图。

### Requirement: 敏感性分析 (Diagnostics) 技能
系统 SHALL 提供观察性研究的遗漏变量偏误量化工具。
#### Scenario: 用户请求检验结果稳健性
- **WHEN** 用户已经跑完一个基准回归，要求计算 E-value 或 Sensemakr
- **THEN** 智能体能够主动询问因变量、核心解释变量及用作基准 (benchmark) 的控制变量，并调用对应函数输出敏感性等高线图。

### Requirement: 流行病学与纵向因果 (Epi & Longitudinal) 技能
系统 SHALL 提供处理医学随访数据和删失事件的因果推断框架。
#### Scenario: 用户请求评估随访队列中的动态干预
- **WHEN** 用户提供包含观察时间 (`time`) 和生存状态 (`event`) 的长面板随访数据
- **THEN** 智能体能够识别数据格式，主动询问干预方案 (`regime`)，并调用 `longitudinal.analyze` 或 `target_trial.emulate` 模拟 RCT 结构进行效应评估，最后绘制 K-M 生存曲线或因果生存森林特征图。