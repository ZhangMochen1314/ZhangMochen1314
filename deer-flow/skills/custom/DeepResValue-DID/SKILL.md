---
name: DeepResValue-DID
description: 双重差分(DID)分析技能。支持平行趋势检验与倾向得分匹配(PSM)。强制优先使用 StatsPAI 库，无法满足时回退到 Python 脚本。
dependency:
  python:
    - pandas
    - statsmodels
    - linearmodels
---

# DeepResValue-DID 双重差分分析

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到数据文件后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()` 和 `.info()`）探查数据结构。
   - DID 模型强依赖面板结构与处理状态。如果用户只说“做个 DID”，**必须主动询问**并确认以下关键参数：
     - **被解释变量 (y)** 是什么？
     - **时间变量 (t)** 和 **个体标识变量 (id)** 是什么？
     - **处理变量 (treatment/policy)** 是什么？或者谁是实验组，政策发生的具体年份是多少？
   - 根据数据探针的结果，如果发现不同个体受政策干预的时间不一样，**必须主动提醒用户**：“您的数据属于交错 DID (Staggered DID) 结构，传统的双向固定效应可能存在负权重偏误，我将为您采用更前沿的 Callaway & Sant'Anna (2021) 异质性稳健估计量”。
2. **任务目标**：进行因果推断中的 DID 分析，包含基准回归、平行趋势检验、安慰剂检验及 PSM-DID。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：编写模型代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **现代异质性 DID (交错 DID)**：处理多期/错期 DID 时，必须优先使用前沿估计量：`from statspai.did.callaway_santanna import callaway_santanna` (CS2021) 或 `from statspai.did.sun_abraham import sun_abraham` (SA2021)。参数通常包含 `data`, `y`, `g` (队列期), `t` (时间), `id_col`。
   - **平行趋势敏感性分析**：如果用户要求做稳健性检验，必须调用 `from statspai.did.honest_did import honest_did` (Rambachan & Roth 2023) 进行“诚实 DID”敏感性分析。
   - **双向固定效应分解**：若用户关注权重问题，使用 `from statspai.did.bacon import bacon_decomposition` 进行 Goodman-Bacon 分解。
   - **反事实插补 (DID Imputation)**：使用 `from statspai.did.did_imputation import did_imputation`。API 签名要求显式传入参数：`group`, `time`, 和 `first_treat`。
   - **合成控制与矩阵补全**：优先使用 `from statspai.synth.mc import mc_synth` 或 `from statspai.matrix_completion.mc_panel import MCPanel`，它会返回一个 `CausalResult` 对象。
   - **异常自修复 (Self-Repair)**：如果在构建矩阵或估计时抛出异常（如非二元处理变量、严重多重共线性），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 获取修复指令自动改写数据。
2. **Fallback 稳健机制**：如果调用 `statspai` 报错或功能暂未涵盖，智能体必须**自动回退**，使用原生的 `linearmodels.PanelOLS` 编写双向固定效应 DID 回归代码。
3. **输出**：调用结果对象的 `.summary()` 或 `CSReport` 生成学术标准的回归结果表格（Markdown），并调用结果对象的 `.plot()` 绘制事件研究平行趋势图（保存为高分辨率图片）。