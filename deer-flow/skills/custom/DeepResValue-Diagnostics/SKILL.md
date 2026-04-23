---
name: DeepResValue-Diagnostics
description: 提供敏感性分析(Sensitivity Diagnostics)功能，包含 Oster 边界、E-value 和 Sensemakr，用于量化遗漏变量偏误。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-Diagnostics 敏感性分析

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到数据文件后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()`）探查数据结构。
   - 敏感性分析是对基准回归结果的“体检”。如果用户要求“做敏感性分析”或“算 E-value / Sensemakr”，**必须主动询问**并确认基准回归设定：
     - 哪个是**结果变量 (y)**？
     - 哪个是**核心处理变量 (treat)**？
     - 哪些是纳入回归模型的**全部观测控制变量 (controls)**？
     - 对于 Sensemakr，是否需要指定某个控制变量作为**基准对比变量 (benchmark)**？（如果不指定，默认用所有的控制变量进行对比）。
   - **严格的数据格式要求检查**：
     - 必须通过探针检查 `[y, treat] + controls`，确保这些列都不含有 `NaN` 缺失值（因为底层 OLS 不允许缺失值），必须主动提醒用户是否剔除含有缺失值的行。
     - 所有传入模型进行诊断的变量必须是数值型或已编码分类变量。
2. **任务目标**：评估因果推断结果（如回归系数）在多大程度上对未观测到的遗漏变量（Omitted Variables）具有稳健性。
3. **禁止捏造**：严禁大模型编造鲁棒性值（如 E-value 大小）或等高线图。必须严格执行代码获取真实检验结果。
4. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **Sensemakr (遗漏变量敏感性)**：`from statspai.diagnostics.sensemakr import sensemakr`。需传入 `data`, `y`, `treat`, `controls`。可选 `benchmark` 列表。
   - **E-value**：`from statspai.diagnostics.evalue import evalue`。基于点估计和置信区间下限，计算推翻当前结论所需的未观测混杂强度。
   - **Oster 边界**：`from statspai.diagnostics.sensitivity import oster_bounds`。
   - **智能修复 (Self-Repair)**：如果在执行 OLS 诊断时触发异常（如完全共线性、奇异矩阵），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动移除共线性特征或改写数据并重试。
   - **标准化报告**：优先调用返回字典或对象（如 `sensemakr` 返回的 dict）并使用自带或自定义格式化工具生成 Markdown 表格，确保包含偏偏相关系数 (Partial $R^2$) 和稳健性阈值 (Robustness Value)。

2. **专业学术可视化 (Professional Plots)**：在生成敏感性图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**对应的绘图函数（如果模块支持 `.plot()` 或 `plot_sensemakr`）来绘制**敏感性等高线图 (Contour Plot)**。切勿自己用 matplotlib 从零拼凑复杂的非线性函数边界图。

3. **Fallback 稳健机制**：如果 `statspai.diagnostics` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，尝试使用 Python 的 `statsmodels` 运行带/不带控制变量的短/长回归手动计算 Oster 的 $R_{max}$ 和 $\delta$，并明确告知用户。

## 结果输出要求
- 必须输出关键敏感性指标：偏偏相关系数 (Partial $R_{Y \sim Z|X}^2$, Partial $R_{D \sim Z|X}^2$)、稳健性阈值 (RV) 以及基准对照（如相对于某个 `benchmark` 变量强多少倍才能推翻结论）。
- 必须输出 E-value 值（点估计与置信区间）。
- 必须生成并在沙盒中展示**敏感性等高线图**（`dpi=300`）。