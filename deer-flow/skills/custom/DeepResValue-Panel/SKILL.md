---
name: DeepResValue-Panel
description: 提供面板数据回归分析功能，支持高维固定效应(HDFE)吸收、交互固定效应及聚类标准误。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-Panel 面板回归分析

## 核心任务与强制规则
1. **任务目标**：处理面板数据，执行带有多维固定效应和多向聚类标准误的回归分析。
2. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **高维固定效应 (HDFE) 回归**：`from statspai.panel.feols import feols`。需传入 `data`, `formula` (如 "y ~ x1 + x2"), `fixed_effects` (如 ["firm", "year"]), `cluster` (如 "firm")。底层会调用 Rust 引擎进行高性能交替投影吸收 (`Absorber`)。
   - **面板二元选择模型**：若因变量为 0/1 虚拟变量，必须调用 `from statspai.panel.panel_binary import panel_logit` 或 `panel_probit`。
   - **交互固定效应**：处理多因子误差结构时，使用 `from statspai.panel.interactive_fe import interactive_fe` (Bai 2009)。
   - **面板模型通用入口**：`from statspai.panel.panel_reg import panel` (支持随机效应和混合OLS)。
   - **智能修复 (Self-Repair)**：如果在执行高维固定效应吸收或聚类时触发异常（如单例组、内存不足等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。
   - **标准化报告**：优先调用返回结果对象（如 `FEOLSResult`）的 `.summary()` 或 `.to_markdown()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成任何图表（如残差图、系数森林图）前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```

3. **Fallback 稳健机制**：如果 `statspai.panel` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，利用原生 `linearmodels.PanelOLS` 编写稳健的面板回归代码。

## 结果输出要求
- 必须输出高维固定效应回归的 Markdown 表格，包含系数、聚类标准误、t值、p值。
- 必须输出模型拟合优度（如 R-squared, Adjusted R-squared）以及固定效应吸收情况。
- 如果用户要求模型选择检验，需输出 Hausman 检验结果结论。