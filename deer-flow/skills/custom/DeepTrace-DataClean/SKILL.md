---
name: DeepTrace-DataClean
description: 数据清洗技能。处理缺失值、异常值和缩尾。强制优先使用 StatsPAI 库进行处理，无法满足时由智能体自行编写 Python 脚本处理。
dependency:
  python:
    - pandas
    - numpy
---

# DeepTrace-DataClean 数据清洗

## 任务目标
为科研面板数据提供自动化的缺失值填补、异常值剔除、Winsorize缩尾处理以及标准化处理。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成数据清洗 Python 代码时，**必须优先尝试导入并使用 `statspai` 库中的数据处理模块**。
2. **Fallback 稳健机制**：如果在调用 `StatsPAI` 时报错或发现该库暂未支持特定的清洗功能，智能体必须**自动回退**，自行使用原生 `pandas`、`numpy` 编写稳健的数据处理代码（如 `df.fillna()`, `df.clip()` 等）。
3. **执行与输出**：代码编写完成后直接在当前沙盒执行，展示清洗前后的统计摘要变化，并输出清洗后的 `.csv` 文件供用户下载。
