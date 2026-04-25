# Enhance Spatial Econometrics Skill Spec

## Why
在对 `statspai` 源码进行深入研读后发现，现有的 `DeepResValue-Spatial` 技能仅覆盖了基础的空间自回归模型和探索性空间数据分析。`StatsPAI` 引擎实际上包含了大量现代空间计量经济学的前沿算法，例如：空间面板模型、拉格朗日乘数检验（LM Tests）、空间双重差分（Spatial DID）、空间工具变量（Spatial IV/S2SLS）以及基于 Geopandas 的 LISA 聚类图绘制功能。为了充分发挥该底层引擎的潜力，需要将这些高级特性及其 API 签名注入到智能体技能配置中，以支持更复杂、更学术的空间数据分析场景。

## What Changes
- 扩展 `DeepResValue-Spatial/SKILL.md`，注入以下高级模块的 API 指引：
  - **空间面板模型 (Spatial Panel Models)**：引入 `statspai.spatial.panel.estimator.spatial_panel`，支持固定效应或双向固定效应的空间模型估计。
  - **空间诊断 (Spatial Diagnostics)**：引入 `statspai.spatial.models.diagnostics.lm_tests`，用于非空间 OLS 模型的空间相关性诊断。
  - **ESDA 绘图 (ESDA Plots)**：引入 `statspai.spatial.esda.plots` 模块中的 `moran_plot` 和 `lisa_cluster_map`，强制大模型使用原生封装绘图。
  - **前沿空间模型 (Advanced Spatial Models)**：引入空间双重差分 (`statspai.spatial.did.spatial_did`) 和空间工具变量 (`statspai.spatial.iv.spatial_iv`)。

## Impact
- Affected specs: `DeepResValue-Spatial` (空间计量技能)
- Affected code: `skills/custom/DeepResValue-Spatial/SKILL.md`

## MODIFIED Requirements
### Requirement: 空间计量分析技能 (DeepResValue-Spatial)
智能体必须能够识别并调用 `StatsPAI` 中的高级空间计量方法：
- **WHEN** 用户提供面板数据并要求进行空间固定效应回归，**THEN** 必须调用 `spatial_panel`。
- **WHEN** 用户要求诊断普通 OLS 是否存在空间误差/滞后，**THEN** 必须调用 `lm_tests`。
- **WHEN** 用户要求绘制 LISA 集聚图或莫兰散点图，**THEN** 必须调用 `lisa_cluster_map` 或 `moran_plot`，而不是使用 matplotlib 从零绘制。
- **WHEN** 用户需要控制空间溢出效应的政策评估，**THEN** 必须调用 `spatial_did`。