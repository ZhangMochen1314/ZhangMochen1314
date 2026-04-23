---
name: DeepResValue-RD
description: 提供断点回归设计(RDD)分析功能，支持精确/模糊断点回归、局部随机化推断、空间断点回归(2D RD)及时间断点回归(RDiT)。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-RD 断点回归分析

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到数据文件后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()` 和 `.info()`）探查数据结构。
   - 断点回归强依赖于**驱动变量(Running Variable)**和**截断点(Cutoff)**。如果用户要求做断点回归，**必须主动询问**并确认：
     - 哪个是**结果变量 (y)**？
     - 哪个是**驱动变量 / 配置变量 (x)**？
     - 具体的**截断点数值 (cutoff / c)** 是多少？
     - 是否存在**实际处理状态 (fuzzy)** 的变量（即是否需要做模糊断点回归）？
   - **严格的数据格式要求检查**：
     - 如果要做**时间断点回归** (`rdit`)，时间列 `time` 和截断点 `cutoff` 必须类型兼容（同为数值型或同为可被 `pd.to_datetime` 解析的日期字符串）。如果包含 `seasonality`，则时间列必须是合法的日期。
     - 如果要做**空间/二维断点回归** (`rd2d`)，必须确认数据中包含两个驱动维度（如 `x1`, `x2`，经纬度）以及明确由 0 和 1 组成的 `treatment` 列。
     - 断点回归在截断点两侧对样本量有严格要求，如果截断点两侧的样本量过少（例如 `rdrobust` 要求两侧至少各有 `p + 2` 个观测值），智能体必须主动向用户提示样本不足的风险。
2. **任务目标**：处理断点回归设计问题，利用截断点前后的样本跳跃来估计局部平均处理效应(LATE)。
3. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
4. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **精确与模糊断点回归 (Sharp/Fuzzy RD)**：`from statspai.rd.rdrobust import rdrobust`。需传入 `data`, `y`, `x`, `c`。若是模糊断点，需传入 `fuzzy` 参数（实际处理状态列名）。
   - **局部随机化断点回归**：`from statspai.rd.locrand import rdrandinf`。适用于断点附近的小窗口推断，需提供窗口 `wl` 和 `wr`。
   - **空间/二维断点回归**：`from statspai.rd.rd2d import rd2d`。需传入 `data`, `y`, `x1`, `x2`, `treatment`。
   - **时间断点回归 (RDiT)**：`from statspai.rd.rdit import rdit`。需传入 `data`, `y`, `time`, `cutoff`。
   - **智能修复 (Self-Repair)**：如果在执行分析时触发异常（如样本量不足、带宽选择失败等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动调整参数（如增大带宽、降低多项式阶数）并重试。
   - **标准化报告**：优先调用返回结果对象（如 `CausalResult`）的 `.summary()` 或 `.to_markdown()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成断点回归拟合图前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**结果对象的 `.plot()` 方法来绘制带有拟合线和置信区间的散点图。切勿自己用 matplotlib 从零拼凑复杂的断点图。

3. **Fallback 稳健机制**：如果 `statspai.rd` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，利用原生 `statsmodels`（如 OLS 加交互项）编写稳健的参数化断点回归代码。

## 结果输出要求
- 必须输出包含 LATE 估计值、稳健标准误、t 值和 p 值的 Markdown 表格。
- 必须明确说明所使用的核函数（Kernel）和最优带宽（Bandwidth）。
- 必须生成并在沙盒中展示断点回归的拟合可视化图表（`dpi=300`）。