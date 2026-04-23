---
name: DeepResValue-Synth
description: 提供合成控制法(SCM)系列功能，支持经典合成控制、广义合成控制(GSynth)、合成双重差分(SDID)及安慰剂检验。
dependency:
  python:
    - pandas
    - numpy
    - scipy
---

# DeepResValue-Synth 合成控制分析

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到数据文件后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()`）探查数据结构，确认数据是否为面板格式（包含个体标识和时间标识）。
   - 合成控制法强依赖于面板结构和处理组的指定。如果用户要求做合成控制，**必须主动询问**并确认以下关键参数：
     - **结果变量 (outcome)** 是什么？
     - **个体标识 (unit)** 和 **时间维度 (time)** 是哪两列？
     - **处理组个体 (treated_unit)** 是哪个（或哪几个）？
     - 政策发生的**首次干预时间 (treatment_time)** 是多少？
   - **严格的数据格式要求检查**：
     - 必须向用户确认数据为**长格式面板数据 (Long-format panel)**。
     - **期数检查**：经典 SCM 和 合成 DID (`sdid`) 要求至少有 2 期干预前的数据；广义合成控制 (`gsynth`) 必须有至少 3 期干预前的数据。如果期数不满足，智能体必须主动拦截并提示用户。
     - **缺失值检查**：控制组个体（Donor pool）在干预前不能含有缺失值。如果存在缺失，必须提示用户进行插补或剔除。
2. **任务目标**：处理面板数据中的政策评估问题，通过为处理组构建“合成控制组”来估计处理效应。
3. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
4. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **经典合成控制 (SCM)**：`from statspai.synth.scm import synth`。需传入 `data`, `outcome`, `unit`, `time`, `treated_unit`, `treatment_time`。
   - **合成双重差分 (SDID)**：`from statspai.synth.sdid import sdid`。结合了 SCM 和 DID 的优势。
   - **广义合成控制 (GSynth)**：`from statspai.synth.gsynth import gsynth`。适用于多处理组个体或基于交互固定效应的场景。
   - **安慰剂检验 (Placebo Test)**：通过在上述函数中设置 `placebo=True`（或根据库的特定参数）来执行。
   - **智能修复 (Self-Repair)**：如果在执行分析时触发异常（如面板不平衡、奇异矩阵等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动清洗数据（如剔除含缺失值的控制组）并重试。
   - **标准化报告**：优先调用返回结果对象（如 `CausalResult`）的 `.summary()` 或 `.to_markdown()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成合成趋势图前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**结果对象的 `.plot()` 方法（例如 `result.plot(type='paths')` 或 `result.plot(type='gap')`）来绘制处理组与合成控制组的趋势对比图，以及效应差异图。切勿自己用 matplotlib 从零拼凑复杂的图表。

3. **Fallback 稳健机制**：如果 `statspai.synth` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，尝试使用双向固定效应（TWFE）或事件研究法作为近似替代方案，并明确告知用户。

## 结果输出要求
- 必须输出包含平均处理效应 (ATT)、推断结果（如 p 值或置信区间）的 Markdown 表格。
- 必须生成并在沙盒中展示处理组与合成控制组的**趋势对比图 (Paths Plot)** 和 **效应差距图 (Gap Plot)**（`dpi=300`）。
- 若执行了安慰剂检验，应输出或展示安慰剂检验的结果（如 RMPE 比值分布或推断 p 值）。