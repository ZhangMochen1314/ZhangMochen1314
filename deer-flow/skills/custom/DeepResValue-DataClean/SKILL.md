---
name: DeepResValue-DataClean
description: 数据清洗技能。处理缺失值、异常值和缩尾。强制优先使用 StatsPAI 库进行处理，无法满足时由智能体自行编写 Python 脚本处理。
dependency:
  python:
    - pandas
    - numpy
---

# DeepResValue-DataClean 数据清洗

## 任务目标
为科研面板数据提供自动化的缺失值填补、异常值剔除、Winsorize缩尾处理以及标准化处理。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成数据清洗 Python 代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **多重插补 (MICE)**：如果用户要求复杂的高级缺失值填补，请使用 `from statspai.imputation.mice import mice, mi_estimate`。
   - **极值缩尾 (Winsorize)**：如果用户要求处理极端异常值，请使用 `from statspai.utils.data_tools import winsor`，例如 `winsor(df, 'income', limits=(0.01, 0.01))`。
   - **智能修复 (Self-Repair)**：如果在执行回归或高级方法时触发异常，请通过正则表达式匹配栈信息，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的修复指令自动改写数据。
   - **注意**：`statspai` 库中**不存在**名为 `statspai.data_clean` 或类似简单单变量填充的模块。如果用户仅要求使用中位数、众数进行简单的单列填充，请**直接使用原生 pandas** 进行处理（如 `df[col] = df[col].fillna(value)`）。
2. **Fallback 稳健机制**：如果在调用 `StatsPAI` 时报错或发现该库暂未支持特定的清洗功能，智能体必须**自动回退**，自行使用原生 `pandas`、`numpy` 编写稳健的数据处理代码（如 `df.fillna()`, `df.clip()` 等），切勿陷入死循环。
3. **执行与输出**：代码编写完成后直接在当前沙盒执行，展示清洗前后的统计摘要变化，并输出清洗后的 `.csv` 文件供用户下载。
