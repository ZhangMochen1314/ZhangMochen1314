---
name: DeepResValue-Matching
description: 提供观察性研究中的匹配方法(Matching)功能，支持倾向得分匹配(PSM)、马氏距离匹配及精确匹配，用于构造对照组并估计处理效应(ATT)。
dependency:
  python:
    - pandas
    - numpy
    - scipy
---

# DeepResValue-Matching 匹配方法分析

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
   - 匹配方法强依赖于二元处理变量和协变量的选择。如果用户要求“做个倾向得分匹配 (PSM)”，**必须主动询问**并确认：
     - 哪个是**结果变量 (y)**？
     - 哪个是**处理变量 (treat)**？
     - 哪些是需要匹配平衡的**协变量 (covariates)**？
     - 希望使用哪种**距离度量 (distance)**（如 `propensity`, `mahalanobis`, `exact`）和**匹配算法 (method)**（如 `nearest`, `stratify`, `cem`）？
   - **严格的数据格式要求检查**：
     - 必须通过探针检查 `treat` 列，**该列必须严格为二元变量（0 和 1）**。如果发现其他格式（如 "Yes"/"No" 或连续值），必须主动提示用户或在代码中进行二值化转换。
     - 协变量 `covariates` 必须为数值型，若存在分类变量（Categorical），需提醒用户转为虚拟变量（Dummy variables）。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：在非实验数据中通过为处理组个体寻找特征相似的控制组个体，以减少混淆偏差，估计处理效应（如 ATT）。
3. **禁止捏造**：严禁大模型编造匹配结果或平衡性检验数据。必须严格执行代码获取真实回归结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **统一匹配接口**：`from statspai.matching.match import match`。
   - **核心参数**：需传入 `data`, `y`, `treat`, `covariates`。对于 PSM，设置 `distance='propensity'`, `method='nearest'`；可选参数如 `estimand='ATT'`, `caliper`（卡尺）, `replace=True/False`。
   - **智能修复 (Self-Repair)**：如果在执行匹配时触发异常（如协变量完全共线性、缺乏共同支撑区等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动调整模型设定并重试。
   - **标准化报告**：优先调用返回对象（如 `CausalResult` 或匹配专有结果对象）的 `.summary()` 或 `.to_markdown()` 生成分析报告，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成匹配相关图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   **绝对优先调用**结果对象的 `.plot()` 方法（例如绘制倾向得分的重叠分布图 `plot(type='overlap')` 或 协变量标准化偏差图 `plot(type='balance')` / Love Plot）。切勿自己用 matplotlib 从零拼凑复杂的图表。

3. **Fallback 稳健机制**：如果 `statspai.matching` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，尝试使用 Python 的原生库（如基于 `sklearn.neighbors.NearestNeighbors` 手写匹配）作为替代方案，并明确告知用户。

## 3. 结果输出要求
- 必须输出匹配后的**处理效应估计值 (如 ATT)** 及其稳健标准误、p 值。
- 必须输出**协变量平衡性检验表 (Covariate Balance Table)**，展示匹配前后各协变量的标准化均值差异 (SMD)。
- 必须生成并在沙盒中展示倾向得分的**共同支撑区分布图 (Overlap Plot)** 以及**协变量平衡图 (Love Plot)**（`dpi=300`）。