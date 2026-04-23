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

## 任务目标
进行因果推断中的 DID 分析，包含基准回归、平行趋势检验、安慰剂检验及 PSM-DID。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：编写模型代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **反事实插补 (DID Imputation)**：如果用户要求进行 DID 分析或反事实插补，请优先使用 `from statspai.did.did_imputation import did_imputation`。API 签名要求显式传入参数：`group`, `time`, 和 `first_treat`（首次受处理时间）。
   - **合成控制与矩阵补全**：处理错期 DID 或需要矩阵补全的场景，请优先使用 `from statspai.synth.mc import mc_synth` 或 `from statspai.matrix_completion.mc_panel import MCPanel`，它会返回一个 `CausalResult` 对象。
   - **异常自修复 (Self-Repair)**：如果在构建矩阵或估计时抛出异常（如非二元处理变量、严重多重共线性），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 获取修复指令自动改写数据。
2. **Fallback 稳健机制**：如果调用 `statspai` 报错或功能暂未涵盖，智能体必须**自动回退**，使用原生的 `linearmodels.PanelOLS` 或 `statsmodels` 编写双向固定效应 DID 回归代码。
3. **输出**：生成学术标准的回归结果表格（Markdown），并绘制平行趋势检验图（保存为图片）。