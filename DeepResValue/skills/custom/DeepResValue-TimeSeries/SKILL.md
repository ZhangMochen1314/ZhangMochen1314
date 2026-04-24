---
name: DeepResValue-TimeSeries
description: 提供时间序列分析功能，支持向量自回归(VAR)、ARIMA、协整检验及用于宏观因果推断的局部投影法(Local Projections)。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-TimeSeries 时间序列分析

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
   - 时间序列分析强依赖于时间索引。如果用户要求“做个 VAR 或时序分析”，**必须主动询问**并确认：
     - 哪个是**时间变量 (time/date)**？数据的频率是什么（如日度、月度、年度）？
     - 需要纳入模型分析的**核心变量 (variables)** 有哪些？
     - 是否有预期的**滞后阶数 (lags)** 或者需要让模型自动选择？
   - **严格的数据格式要求检查**：
     - 必须通过探针检查时间列，并将其转换为 `pandas.DatetimeIndex`。
     - 如果时间序列中存在缺失值（如某个月份的数据缺失），必须主动提示用户，并在调用底层函数前进行插值（如线性插值）或剔除。因为 VAR 和 ARIMA 底层函数不允许输入数据包含 `NaN`。
     - 必须确保提取出的 `variables` 列全是数值型（`float`）。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：对宏观经济或金融时序数据进行动态关系建模，估计变量间的脉冲响应或预测未来趋势。
3. **禁止捏造**：严禁大模型编造系数或脉冲响应数据。必须严格执行代码获取真实回归结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **向量自回归 (VAR)**：`from statspai.timeseries.var import var`。需传入 `data`, `variables`, `lags`, `trend`。
   - **局部投影法 (Local Projections)**：`from statspai.timeseries.local_projections import local_projections`。适用于对非线性或长视角的动态因果响应进行稳健估计。
   - **协整检验**：`from statspai.timeseries.cointegration import cointegration_test`。
   - **智能修复 (Self-Repair)**：如果在执行时序建模时触发异常（如样本量不足以支撑所选滞后阶数、数据非平稳），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动降低滞后阶数或对数据进行差分处理并重试。
   - **标准化报告**：优先调用返回对象（如 `VARResult`）的 `.summary()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成脉冲响应图或时序趋势图前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**结果对象的 `.plot_irf()`（脉冲响应函数图）或 `.plot()` 方法来展示动态效应。切勿自己用 matplotlib 从零拼凑。

3. **Fallback 稳健机制**：如果 `statspai.timeseries` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，尝试使用原生的 `statsmodels.tsa`（如 `VAR`, `ARIMA`）进行稳健估计。

## 3. 结果输出要求
- 必须输出核心方程的系数估计表及相应的统计显著性检验结果。
- 必须生成并在沙盒中展示**脉冲响应函数图 (IRF Plot)** 或**预测趋势图**（`dpi=300`），需包含置信区间带。