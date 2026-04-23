---
name: DeepTrace-Spatial
description: 空间计量经济学技能。计算空间权重矩阵并估计 SDM/SAR/SEM 模型。强制优先使用 StatsPAI，无法满足时回退。
dependency:
  python:
    - pandas
    - geopandas
    - libpysal
    - spreg
---

# DeepTrace-Spatial 空间计量

## 任务目标
计算地理距离/经济距离空间权重矩阵，并执行空间自回归模型(SAR)、空间误差模型(SEM)及空间杜宾模型(SDM)的估计。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在构建权重矩阵和估计模型时，**必须优先调用 `statspai.spatial`** 模块。
2. **Fallback 稳健机制**：如果 `StatsPAI` 暂未涵盖所需空间计量功能或发生异常，智能体必须**自动回退**，利用原生的 `libpysal` 和 `spreg` 库编写 Python 脚本完成估计。
3. **输出**：生成莫兰指数(Moran's I)检验结果、回归系数表及直接/间接效应分解，输出为 Markdown 格式。