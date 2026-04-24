---
name: DeepResValue-Mediation
description: 提供机制检验与因果中介效应分析功能，支持计算自然直接效应(NDE)、自然间接效应(NIE)及四向分解。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-Mediation 机制检验与中介效应

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
   - 机制检验和中介分析依赖于明确的因果路径设定。如果用户只说“做个机制检验”，**必须主动询问**并确认因果链条中的关键变量：
     - 哪个是**原因变量 / 处理变量 (treatment/d)**？
     - 哪个是**中介变量 / 机制变量 (mediator/m)**？
     - 哪个是**结果变量 (outcome/y)**？
     - 哪些是需要控制的**协变量 (covariates/x)**？
   - 必须检查原因变量 (d) 和中介变量 (m) 的数据类型（连续型或离散二元型），如果存在非标准的分类变量，应主动询问用户如何编码（如 0/1）。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：解决机制分析问题，基于反事实框架进行因果中介分析及敏感性检验。
2. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
2. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。
   - **基础中介效应**：`from statspai.mediation.mediate import mediate`。需传入 `data`, `y` (结果变量), `d` (处理变量), `m` (中介变量), `x` (协变量)。
   - **四向效应分解**：`from statspai.mediation.four_way import four_way_decomposition`。用于计算受控直接效应、参考交互作用等。
   - **敏感性分析**：`from statspai.mediation.sensitivity import mediate_sensitivity`。
   - **智能修复 (Self-Repair)**：如果在执行分析时触发异常（如数据不平衡、类型不匹配等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。
   - **标准化报告**：优先调用返回对象（如 `MediationAnalysis`）的 `.summary()` 或 `.to_markdown()` 生成分析结果。

2. **专业学术可视化 (Professional Plots)**：在生成敏感性分析或中介效应图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   推荐直接使用 `result.plot()` 方法（若可用）。

2. **容错与降级机制 (Fallback to Native Python)**：
   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，或者遇到库暂未支持的功能，你必须触发**平滑降级**：
   - **立即放弃使用 `statspai`**。
   - 转而使用原生的 `statsmodels`, `linearmodels`, 或 `scikit-learn` 编写稳健的备用代码。
   - 在向用户解释时，请礼貌地说明：“由于数据复杂性导致高级估计量无法收敛，我已自动为您切换到经典的备用模型进行评估。”

## 3. 结果输出要求
- 必须输出包含 NDE（自然直接效应）和 NIE（自然间接效应）及其 Bootstrap 置信区间和 p 值的 Markdown 表格。
- 必须输出中介效应占比（Proportion Mediated）。
- 生成的敏感性分析图或分解结果柱状图必须保存为高分辨率图片展示（`dpi=300`）。
