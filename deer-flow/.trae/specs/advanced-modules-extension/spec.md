# StatsPAI Advanced Modules Extension Spec

## Why
在前面的迭代中，我们已经成功将断点回归 (RD)、合成控制 (Synth) 和元学习器因果森林等模块开发成了智能体技能。现在用户明确要求将 **双重机器学习 (DML)** 以及 **匹配方法 (Matching)**（由于用户输入了 "1" 结合上下文指的是第一组的高频刚需模块，即 matching、timeseries、diagnostics 等，此处我们将核心的 DML 和 Matching 一并纳入开发范围，以最大化提升系统的因果推断能力）开发为独立的科研智能体技能。为了保证新技能的高质量与高鲁棒性，我们需要继续沿用 `.trae/SKILLS_ITERATION_LOG.md` 中的“四步走”防呆方法论。

## What Changes
- **开发 `DeepResValue-DML` 技能**：基于 `statspai.dml` 模块，为高维混淆变量场景提供双重机器学习估计。支持部分线性回归 (PLR) 和交互回归模型 (IRM) 等变体。
- **开发 `DeepResValue-Matching` 技能**：基于 `statspai.matching` 模块，提供倾向得分匹配 (PSM) 和其他距离度量方法，用于观察性研究中的对照组构造。
- 在这两个新技能的 `SKILL.md` 中，严格注入“意图澄清与数据预检”机制、精确的 API 调用路径以及 `statspai.plots` 的学术可视化规范。

## Impact
- Affected specs: 扩展系统的实证分析技能库。
- Affected code:
  - 新增 `/workspace/deer-flow/skills/custom/DeepResValue-DML/SKILL.md`
  - 新增 `/workspace/deer-flow/skills/custom/DeepResValue-Matching/SKILL.md`

## ADDED Requirements
### Requirement: 双重机器学习 (DML) 技能
系统 SHALL 提供处理高维控制变量的因果推断能力。
#### Scenario: 用户请求高维数据因果推断
- **WHEN** 用户提供包含大量协变量的数据并要求估计因果效应
- **THEN** 智能体能够主动询问处理变量是否为二元（以决定使用 PLR 还是 IRM），并调用 `statspai.dml.double_ml.dml` 函数利用交叉拟合输出无偏的 ATE 估计。

### Requirement: 匹配方法 (Matching) 技能
系统 SHALL 提供基于距离度量的观察性数据匹配能力。
#### Scenario: 用户请求匹配分析
- **WHEN** 用户要求使用倾向得分匹配 (PSM) 控制混淆变量
- **THEN** 智能体能够调用 `statspai.matching.match.match` 函数，并在匹配后输出协变量平衡性检验结果和专业图表。