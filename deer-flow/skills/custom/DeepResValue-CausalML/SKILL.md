---
name: DeepResValue-CausalML
description: 提供基于机器学习的因果推断功能，支持因果森林(Causal Forest)、X-Learner等元学习器，用于估计异质性处理效应(CATE)。
dependency:
  python:
    - pandas
    - numpy
    - scikit-learn
---

# DeepResValue-CausalML 机器学习因果推断

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到数据文件后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()`）探查数据结构。
   - 机器学习因果推断（如 CATE 估计）依赖于清晰的变量划分。**必须主动询问**并确认：
     - 哪个是**结果变量 (Y)**？
     - 哪个是**处理变量 (T / D)**？
     - 哪些是用于计算异质性效应的**修饰特征变量 (X)**？
     - 哪些是仅用于控制混淆偏差的**协变量 (W)**（如果有）？
   - **严格的数据格式要求检查**：
     - 处理变量 `T` 必须是二元变量（0 和 1）。如果探针发现不是 0/1（例如是 "Yes"/"No" 或连续值），必须主动提示用户进行二值化转换。
     - 如果使用 `causal_forest` 直接传入数组（非 formula 模式），特征矩阵 `X` 和 `W` 必须是二维数组（如 `(N, K)`），而 `Y` 和 `T` 必须是一维数组（如 `(N,)`）。
2. **任务目标**：利用随机森林或元学习器框架，估计个体层面的异质性处理效应（CATE）和平均处理效应（ATE）。
3. **禁止捏造**：严禁大模型编造特征重要性或效应估计值。必须严格执行代码获取真实模型结果。
4. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **因果森林 (Causal Forest)**：`from statspai.causal.causal_forest import causal_forest`。支持 `formula` 模式或传入 NumPy 数组 `Y, T, X, W`。
   - **元学习器 (X-Learner)**：`from statspai.metalearners.metalearners import metalearner`。传入 `learner='x'`。
   - **智能修复 (Self-Repair)**：如果在模型拟合或预测时触发异常（如维度不匹配、树模型深度超限），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动调整超参数（如 `min_samples_leaf`）并重试。
   - **标准化报告**：优先调用返回对象（如 `CausalForest` 的预测结果或 `CausalResult`）的 `.summary()` 或 `.to_markdown()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成特征重要性图或 CATE 分布直方图前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**模型对象的 `.plot()` 方法（若存在）来展示 CATE 的分布或重要性。

3. **Fallback 稳健机制**：如果 `statspai.causal` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，尝试使用基础的 `scikit-learn`（如 `RandomForestRegressor`）手写一个 T-Learner 进行估算。

## 结果输出要求
- 必须输出平均处理效应 (ATE) 及其置信区间。
- 必须输出异质性处理效应 (CATE) 的关键统计量（如均值、中位数、标准差）。
- 必须生成并在沙盒中展示 CATE 分布的直方图或核密度图，以及 Top-N 个特征的重要性排序柱状图（`dpi=300`）。