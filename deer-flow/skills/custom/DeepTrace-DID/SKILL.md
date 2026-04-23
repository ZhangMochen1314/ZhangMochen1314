---
name: DeepTrace-DID
description: 双重差分(DID)分析技能。支持平行趋势检验与倾向得分匹配(PSM)。强制优先使用 StatsPAI 库，无法满足时回退到 Python 脚本。
dependency:
  python:
    - pandas
    - statsmodels
    - linearmodels
---

# DeepTrace-DID 双重差分分析

## 任务目标
进行因果推断中的 DID 分析，包含基准回归、平行趋势检验、安慰剂检验及 PSM-DID。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：编写模型代码时，**必须优先使用 `statspai.causal.did`** 等相关模块完成因果推断的估计与检验。
2. **Fallback 稳健机制**：如果 `StatsPAI` 调用失败，智能体必须**自动回退**，使用 `linearmodels.PanelOLS` 或 `statsmodels` 编写原生的双向固定效应 DID 回归代码。
3. **输出**：生成学术标准的回归结果表格（Markdown），并绘制平行趋势检验图（保存为图片）。