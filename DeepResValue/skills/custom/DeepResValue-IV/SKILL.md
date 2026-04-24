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

## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。
   - **基础 2SLS IV 估计**：
     ```python
     import pandas as pd
     from statspai.iv.iv2sls import iv2sls
     
     df = pd.read_csv('/mnt/user-data/workspace/uploads/你的数据.csv')
     # 参数要求：data(数据集), y(被解释变量), d(内生变量), z(工具变量列表), x(外生控制变量列表,可选)
     res = iv2sls(data=df, y='你的y', d='内生变量', z=['工具变量1'], x=['控制变量1'])
     print(res.summary())
     ```
   - **双重机器学习 IV (DML-IV)**：如果用户需要处理高维控制变量，使用 `from statspai.iv.ivdml import ivdml`。
   - **弱工具变量检验**：如果用户要求检验，必须使用：
     ```python
     from statspai.iv.weak_identification import kleibergen_paap_rk
     
     kp_res = kleibergen_paap_rk(data=df, y='你的y', d='内生变量', z=['工具变量1'], x=['控制变量1'])
     print(kp_res.summary())
     ```
   - **异常自修复 (Self-Repair)**：如果在执行 `statspai` 时报错，请**仔细阅读错误栈中的 `recovery_hint`（修复提示）**。修复数据后**重新尝试调用 `statspai`**。

2. **容错与降级机制 (Fallback to Native Python)**：
   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，或者遇到明确提示未实现的方法，你必须触发**平滑降级**：
   - **立即放弃使用 `statspai`**。
   - 转而使用原生的 `linearmodels.IV2SLS` 编写稳健的 2SLS 估计代码。
   - **降级代码示例 (Fallback Code)**：
     ```python
     from linearmodels.iv import IV2SLS
     import statsmodels.api as sm
     
     # 添加常数项
     df['const'] = 1
     # 构造模型: Y ~ X + [D ~ Z]
     # 注意：linearmodels 要求显式传入内生变量和工具变量
     iv_mod = IV2SLS(dependent=df['你的y'], 
                     exog=df[['const', '控制变量1']], 
                     endog=df[['内生变量']], 
                     instruments=df[['工具变量1']])
     iv_res = iv_mod.fit(cov_type='robust')
     print(iv_res.summary)
     ```

## 3. 结果输出要求
- 输出的 Markdown 表格必须包含第一阶段 F 值、第二阶段估计系数、标准误、t值和 p值。
- 若执行了弱工具变量检验，必须输出 K-P rk Wald F 统计量，并与 Stock-Yogo 临界值对比得出结论。
- 所有生成的图表保存为图片并在沙盒中展示（`dpi=300`）。