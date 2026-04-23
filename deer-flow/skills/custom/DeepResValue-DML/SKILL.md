---
name: DeepResValue-DML
description: 提供双重机器学习(DML)因果推断功能，支持处理高维混淆变量，包含部分线性回归(PLR)和交互回归模型(IRM)。
dependency:
  python:
    - pandas
    - numpy
    - scikit-learn
---

# DeepResValue-DML 双重机器学习分析

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到数据文件后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()`）探查数据结构。
   - 双重机器学习依赖于高维控制变量的选择和处理变量的类型。如果用户要求“做个双重机器学习”，**必须主动询问**并确认：
     - 哪个是**结果变量 (y)**？
     - 哪个是**处理变量 (treat)**？
     - 哪些是用于交叉拟合去偏的**高维控制变量/协变量 (covariates)**？
     - 是否存在**工具变量 (instrument)**（以决定是否使用 `pliv` 或 `iivm`）？
   - **严格的数据格式要求检查**：
     - 如果用户想使用交互回归模型 (`model='irm'`) 或交互工具变量 (`model='iivm'`)，必须通过探针检查 `treat` 列，**该列必须严格为二元变量（0 和 1）**。如果发现是连续变量，必须主动提示用户改为使用部分线性模型 (`model='plr'`) 或部分线性工具变量 (`model='pliv'`)。
     - 若存在分类协变量（Categorical），需提醒用户进行独热编码（One-Hot Encoding）。
2. **任务目标**：处理高维控制变量场景，利用交叉拟合和正交矩，实现对平均处理效应 (ATE) 的无偏因果推断。
3. **禁止捏造**：严禁大模型编造估计效应或标准误。必须严格执行代码获取真实回归结果。
4. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **核心函数**：`from statspai.dml.double_ml import dml`。
   - **参数配置**：需传入 `data`, `y`, `treat`, `covariates`。根据处理变量类型自动选择 `model`（二元选 `irm`，连续选 `plr`）。如果用户提供了 `instrument` 参数，则对应选择 `iivm` 或 `pliv`。
   - **机器学习估计器 (ML Estimators)**：默认不传入 `ml_g`, `ml_m`, `ml_r` 时底层会使用梯度提升树。如果用户要求更换模型（如 Lasso, Random Forest），请使用 `sklearn` 兼容的估计器传入。
   - **智能修复 (Self-Repair)**：如果在执行 DML 交叉拟合时触发异常（如样本量过小导致 K-Fold 失败），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动调整 `n_folds` 或 `n_rep` 并重试。
   - **标准化报告**：优先调用返回结果对象（如 `CausalResult` 或 `DMLResult`）的 `.summary()` 或 `.to_markdown()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成机器学习因果推断图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**结果对象的 `.plot()` 方法来绘制 DML 相关的残差图、变量重要性或效应分布图（若库支持）。切勿自己用 matplotlib 从零拼凑。

3. **Fallback 稳健机制**：如果 `statspai.dml` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，尝试使用 Python 的原生库（如手动编写交叉拟合步骤的 Lasso + OLS 两步法）作为替代方案，并明确告知用户。

## 结果输出要求
- 必须输出**双重机器学习估计效应值 (DML Estimate)** 及其稳健标准误、z/t 值和 p 值。
- 必须明确报告所选用的底层机器学习模型（如 Gradient Boosting, Random Forest）、折数 (`n_folds`) 和重复次数 (`n_rep`)。
- 若执行了 PLIV / IIVM，需额外输出第一阶段弱工具变量相关的检验结果（若有）。