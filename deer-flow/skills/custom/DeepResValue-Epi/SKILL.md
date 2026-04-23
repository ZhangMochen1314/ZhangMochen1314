---
name: DeepResValue-Epi
description: 提供流行病学、纵向因果分析(Longitudinal)及生存分析(Survival)功能。包含AFT/Cox模型、因果生存森林及观察性数据的目标试验模拟(Target Trial Emulation)。
dependency:
  python:
    - pandas
    - numpy
    - scipy
---

# DeepResValue-Epi 流行病学与纵向生存分析

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到数据文件后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()` 和 `.info()`）探查数据结构。
   - 流行病学与生存分析强依赖于“时间-事件”结构或纵向追踪格式。**必须主动询问**并确认：
     - 如果用户要求“**做个生存分析**”，必须确认：哪个是**观察时间 (duration/time)**？哪个是**事件指示器 (event/status，通常1为发生，0为删失)**？
     - 如果用户要求“**做纵向因果推断**”（如 MSM, g-formula），必须确认：数据是否为长格式面板？哪个是**时间标识 (time)** 和**个体标识 (id)**？哪个是随时间变化的**干预方案 (regime/treatment)**？
     - 如果用户要求“**目标试验模拟** (Target Trial Emulation)”，必须确认试验的干预组/对照组定义（`protocol`）及基线时间点 (`time_zero_filter`)。
   - **严格的数据格式要求检查**：
     - 对于**生存模型 (AFT / Cox)**，探针必须检查 `duration` 列，**所有值必须严格大于 0**，若存在 `<= 0` 的非正数值（或空值），必须主动提醒用户剔除或加上一个微小的正数（如 `1e-12`）。
     - `event` 列必须是二元或布尔类型（1 发生，0 删失）。
     - 对于**流行病学基础检验 (如 Mantel-Haenszel)**，输入列联表必须是 `(K, 2, 2)` 的三维数组，如果有任何分层样本量为0，必须主动平滑（加 0.5）。
     - 纵向因果推断 `analyze` 强制要求长格式 `DataFrame`。
2. **任务目标**：处理医学随访数据、存在删失的生存时间数据以及观察性队列数据，估计动态治疗方案（Dynamic Regimes）的因果效应或危险比（Hazard Ratios）。
3. **禁止捏造**：严禁大模型编造 HR 值、中位生存时间或置信区间。必须严格执行代码获取真实检验结果。
4. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **生存分析 (AFT & Cox)**：`from statspai.survival.aft import aft` 或 `from statspai.survival.models import cox`。
   - **因果生存森林**：`from statspai.survival.causal_forest import causal_survival_forest`。需明确传入 `time`, `event`, `treat` 和 `covariates`。
   - **目标试验模拟 (Target Trial)**：`from statspai.target_trial.emulate import emulate`。需先构建 `TargetTrialProtocol`。
   - **纵向因果 (Longitudinal Data)**：`from statspai.longitudinal.analyze import analyze`。处理随时间变化的混杂（Time-varying Confounding），可选 `method` 为 `"msm"`, `"g-formula"`, `"ipw"`。
   - **流行病学基础**：`odds_ratio`, `mantel_haenszel`, `direct_standardize` 位于 `statspai.epi`。
   - **智能修复 (Self-Repair)**：如果在执行生存回归时触发异常（如全删失、共线性矩阵不可逆、非正持续时间），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动修正数据并重试。
   - **标准化报告**：优先调用返回对象（如 `AFTResult`, `CoxResult`, `TargetTrialResult`）的 `.summary()` 生成学术格式表格（包含 Coefficient, HR, 95% CI）。

2. **专业学术可视化 (Professional Plots)**：在生成生存曲线图前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**结果对象的 `.plot()` 方法（例如绘制 **Kaplan-Meier 生存曲线对比图** 或 **累积风险图**）。切勿自己用 matplotlib 从零拼凑阶梯图（step-plot）。

3. **Fallback 稳健机制**：如果 `statspai` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，尝试使用 Python 的开源生态（如 `lifelines.CoxPHFitter`, `lifelines.WeibullAFTFitter`）进行生存模型估算。

## 结果输出要求
- 必须输出回归模型或因果估计的关键指标（如 **Hazard Ratio (HR) 及其置信区间**、加速因子 (AF) 或因果生存差异）。
- 对于流行病学检验，需明确输出 Mantel-Haenszel 合并后的 OR / RR 值及 $p$ 值。
- 必须生成并在沙盒中展示 **K-M 生存曲线图 (Survival Function Plot)**（`dpi=300`），标明不同干预组的风险对比。