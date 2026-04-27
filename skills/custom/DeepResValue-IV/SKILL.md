---
name: DeepResValue-IV
description: 提供工具变量(IV)估计与内生性检验功能，支持双重机器学习IV、非参数IV及弱工具变量检验。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-IV 工具变量分析

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
   - 工具变量估计依赖于严谨的变量划分。如果用户只说“跑个工具变量回归”，**必须主动询问**并确认以下核心变量：
     - 哪个是**被解释变量 (y)**？
     - 哪个是**内生解释变量 (endog/d)**？
     - 哪个是**工具变量 (instruments/z)**？
     - 哪些是**外生控制变量 (exog/x)**？
   - 若用户提供了多个工具变量，**必须主动询问**是否需要进行过度识别检验（如 Sargan-Hansen test）。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：解决模型中的内生性问题，执行工具变量估计（IV）、弱工具变量检验（Weak IV Test）及内生性检验。
2. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
2. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **双重机器学习 IV**：`from statspai.iv.ivdml import ivdml`。需传入 `data`, `y`, `d` (内生变量), `z` (工具变量), `x` (外生控制变量)。
   - **非参数 IV**：`from statspai.iv.npiv import npiv`。
   - **弱工具变量检验**：`from statspai.iv.weak_identification import kleibergen_paap_rk`。
   - **弱 IV 稳健置信区间**：`from statspai.iv.weak_iv_ci import anderson_rubin_ci`。
   - **智能修复 (Self-Repair)**：如果在执行分析时触发异常（如工具变量共线性等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。
   - **标准化报告**：调用返回结果对象的 `.summary()` 或 `.to_markdown()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成任何图表（如第一阶段拟合散点图、系数森林图）前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```

3. **Fallback 稳健机制**：如果 `statspai.iv` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，利用原生 `linearmodels.IV2SLS` 编写稳健的 2SLS 估计与绘图代码。

## 3. 结果输出要求
- 输出的 Markdown 表格必须包含第一阶段 F 值、第二阶段估计系数、标准误、t值和 p值。
- 若执行了弱工具变量检验，必须输出 K-P rk Wald F 统计量，并与 Stock-Yogo 临界值对比得出结论。
- 所有生成的图表保存为图片并在沙盒中展示（`dpi=300`）。