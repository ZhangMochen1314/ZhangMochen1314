---
name: DeepResValue-Spatial
description: 空间计量经济学技能。计算空间权重矩阵并估计 SDM/SAR/SEM 模型。强制优先使用 StatsPAI，无法满足时回退。
dependency:
  python:
    - pandas
    - geopandas
    - libpysal
    - spreg
---

# DeepResValue-Spatial 空间计量

## 任务目标
计算地理距离/经济距离空间权重矩阵，并执行空间自回归模型(SAR)、空间误差模型(SEM)及空间杜宾模型(SDM)的估计。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在构建权重矩阵和估计模型时，**必须优先尝试导入并使用 `statspai` 库**。
   - **空间权重矩阵**：请优先使用 `statspai.spatial` 模块来计算地理距离或经济距离矩阵。
   - **智能修复 (Self-Repair)**：如果在执行回归（SAR/SEM/SDM）或计算莫兰指数时触发了共线性或矩阵不可逆等异常，请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息来调整模型参数或清洗数据。
2. **Fallback 稳健机制**：如果调用 `statspai` 报错或功能暂未涵盖，智能体必须**自动回退**，利用原生的 `libpysal` 和 `spreg` 库编写 Python 脚本完成估计。
3. **输出**：生成莫兰指数(Moran's I)检验结果、回归系数表及直接/间接效应分解，输出为 Markdown 格式。