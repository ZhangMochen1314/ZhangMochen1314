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

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
   - 双重机器学习依赖于高维控制变量的选择和处理变量的类型。如果用户要求“做个双重机器学习”，**必须主动询问**并确认：
     - 哪个是**结果变量 (y)**？
     - 哪个是**处理变量 (treat)**？
     - 哪些是用于交叉拟合去偏的**高维控制变量/协变量 (covariates)**？
     - 是否存在**工具变量 (instrument)**（以决定是否使用 `pliv` 或 `iivm`）？
   - **严格的数据格式要求检查**：
     - 如果用户想使用交互回归模型 (`model='irm'`) 或交互工具变量 (`model='iivm'`)，必须通过探针检查 `treat` 列，**该列必须严格为二元变量（0 和 1）**。如果发现是连续变量，必须主动提示用户改为使用部分线性模型 (`model='plr'`) 或部分线性工具变量 (`model='pliv'`)。
     - 若存在分类协变量（Categorical），需提醒用户进行独热编码（One-Hot Encoding）。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：处理高维控制变量场景，利用交叉拟合和正交矩，实现对平均处理效应 (ATE) 的无偏因果推断。
3. **禁止捏造**：严禁大模型编造估计效应或标准误。必须严格执行代码获取真实回归结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。
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

2. **容错与降级机制 (Fallback to Native Python)**：
   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，或者遇到库暂未支持的功能，你必须触发**平滑降级**：
   - **立即放弃使用 `statspai`**。
   - 转而使用原生的 `statsmodels`, `linearmodels`, 或 `scikit-learn` 编写稳健的备用代码。
   - 在向用户解释时，请礼貌地说明：“由于数据复杂性导致高级估计量无法收敛，我已自动为您切换到经典的备用模型进行评估。”

## 3. 结果输出要求
- 必须输出**双重机器学习估计效应值 (DML Estimate)** 及其稳健标准误、z/t 值和 p 值。
- 必须明确报告所选用的底层机器学习模型（如 Gradient Boosting, Random Forest）、折数 (`n_folds`) 和重复次数 (`n_rep`)。
- 若执行了 PLIV / IIVM，需额外输出第一阶段弱工具变量相关的检验结果（若有）。
