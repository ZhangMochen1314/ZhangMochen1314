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

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
   - 断点回归强依赖于**驱动变量(Running Variable)**和**截断点(Cutoff)**。如果用户要求做断点回归，**必须主动询问**并确认：
     - 哪个是**结果变量 (y)**？
     - 哪个是**驱动变量 / 配置变量 (x)**？
     - 具体的**截断点数值 (cutoff / c)** 是多少？
     - 是否存在**实际处理状态 (fuzzy)** 的变量（即是否需要做模糊断点回归）？
   - **严格的数据格式要求检查**：
     - 如果要做**时间断点回归** (`rdit`)，时间列 `time` 和截断点 `cutoff` 必须类型兼容（同为数值型或同为可被 `pd.to_datetime` 解析的日期字符串）。如果包含 `seasonality`，则时间列必须是合法的日期。
     - 如果要做**空间/二维断点回归** (`rd2d`)，必须确认数据中包含两个驱动维度（如 `x1`, `x2`，经纬度）以及明确由 0 和 1 组成的 `treatment` 列。
     - 断点回归在截断点两侧对样本量有严格要求，如果截断点两侧的样本量过少（例如 `rdrobust` 要求两侧至少各有 `p + 2` 个观测值），智能体必须主动向用户提示样本不足的风险。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：处理断点回归设计问题，利用截断点前后的样本跳跃来估计局部平均处理效应(LATE)。
3. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。
   - **精确与模糊断点回归 (Sharp/Fuzzy RD)**：
     ```python
     import pandas as pd
     from statspai.rd.rdrobust import rdrobust
     
     df = pd.read_csv('/mnt/user-data/workspace/uploads/你的数据.csv')
     # 参数要求：data(数据集), y(被解释变量), x(驱动变量), c(截断点)
     # fuzzy: 如果是模糊断点，传入实际处理状态列名，精确断点留空
     res = rdrobust(data=df, y='你的y', x='驱动变量', c=0.0)
     print(res.summary())
     
     # 绘制并保存断点图
     fig = res.plot()
     fig.savefig('/mnt/user-data/workspace/outputs/rd_plot.png', dpi=300)
     ```
   - **局部随机化断点回归**：`from statspai.rd.locrand import rdrandinf`。适用于断点附近的小窗口推断。
   - **时间断点回归 (RDiT)**：`from statspai.rd.rdit import rdit`。需传入 `data`, `y`, `time`, `cutoff`。
   - **异常自修复 (Self-Repair)**：如果在执行 `statspai` 时报错（如样本量不足、带宽选择失败等），请**仔细阅读错误栈中的 `recovery_hint`**，自动调整参数（如降低多项式阶数）并**重新尝试调用**。

2. **容错与降级机制 (Fallback to Native Python)**：
   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，你必须触发**平滑降级**：
   - **立即放弃使用 `statspai`**。
   - 转而使用原生的 `statsmodels`（如 OLS 加交互项）编写参数化断点回归代码。
   - **降级代码示例 (Fallback Code)**：
     ```python
     import statsmodels.formula.api as smf
     
     cutoff = 0.0
     # 构造中心化变量和处理虚拟变量
     df['x_centered'] = df['驱动变量'] - cutoff
     df['treat'] = (df['x_centered'] >= 0).astype(int)
     
     # 参数化 RD 回归：y ~ treat + x_centered + treat:x_centered
     mod = smf.ols("你的y ~ treat * x_centered", data=df)
     res = mod.fit(cov_type='HC1')
     print(res.summary())
     ```

## 3. 结果输出要求
- 必须输出包含 LATE 估计值、稳健标准误、t 值和 p 值的 Markdown 表格。
- 必须明确说明所使用的核函数（Kernel）和最优带宽（Bandwidth）。
- 必须生成并在沙盒中展示断点回归的拟合可视化图表（`dpi=300`）。