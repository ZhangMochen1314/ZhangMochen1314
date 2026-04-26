# Add Empirical Variable Selector Skill Spec

## Why
在实证分析（Empirical Analysis）中，用户常常面对包含数十甚至上百个变量的原始数据集，不知道哪些变量（特征）既在统计上显著（显著性 $p < 0.05$ 或 $0.1$），又在语义上高度符合其研究主题（Research Theme）。
目前开源界虽然有纯统计学的特征选择工具（如 `scikit-learn` 的 Lasso/RFE，`statsmodels` 的逐步回归），以及纯语义的文本匹配工具（如 `Sentence-Transformers`），但**没有现成的专业开源项目能够开箱即用地同时满足“学术语义对齐”与“计量经济学显著性检验”的双重需求**。
因此，我们需要在当前智能体项目中自主开发一个名为 `DeepResValue-EmpiricalSelector` 的专属技能（Skill），将大模型的业务理解能力与 Python 统计库（如 `statsmodels`）无缝集成。

## What Changes
- 在 `skills/custom/` 目录下创建 `DeepResValue-EmpiricalSelector` 技能文件夹。
- 编写 `SKILL.md`，定义该技能的意图澄清（获取被解释变量 Y 和研究主题）、双重过滤策略和输出规范。
- 编写核心 Python 脚本 `scripts/variable_selector.py`，实现双重过滤管道（Pipeline）：
  1. **Semantic Evaluation（语义评估）**：提取数据列名/数据字典，要求大模型评估哪些变量与“用户研究主题”在经济学逻辑上相关，作为候选解释变量集。
  2. **Statistical Filtering（统计显著性过滤）**：使用 `statsmodels` 自动对候选变量与被解释变量（Y）进行单变量或多变量回归分析，保留 $p$-value 达标的显著变量。
- 增加输出可视化功能：生成保留变量的相关性热力图（Correlation Heatmap）或火山图（Volcano Plot），并输出规范的 Markdown 分析报告。

## Impact
- Affected specs: 这是一个新增的独立实证分析技能，增强了系统在“研究设计与数据探索”阶段的能力，不破坏现有功能。
- Affected code:
  - `skills/custom/DeepResValue-EmpiricalSelector/SKILL.md`
  - `skills/custom/DeepResValue-EmpiricalSelector/scripts/variable_selector.py`

## ADDED Requirements
### Requirement: 核心解释变量智能筛选
The system SHALL provide a skill that automatically selects core explanatory variables from a raw dataset based on semantic theme matching and statistical significance.

#### Scenario: Success case
- **WHEN** 用户上传数据集（如 CSV/Excel）并声明研究主题（如：“研究数字化转型对企业创新的影响，因变量是专利数”），并触发变量筛选。
- **THEN** 智能体首先调用脚本过滤出与“数字化转型”和“创新”逻辑相关的变量，随后运行 OLS/Logit 检验其显著性，最后输出一个包含“推荐核心解释变量、p-value、经济学含义”的结构化 Markdown 报告，并附带相关系数热力图。
