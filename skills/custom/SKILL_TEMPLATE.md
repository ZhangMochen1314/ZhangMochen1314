---
name: DeepResValue-[SkillName]
description: [简短描述该技能的功能，例如：提供面板数据分析、固定效应模型等高级计量经济学功能]
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-[SkillName] [中文名称]

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量（如处理变量、结果变量、时间/个体标识、空间权重等），必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。
   - [在此处填写特定的要求，如：是否要求严格的平衡面板？特定列是否必须为 0/1 虚拟变量？是否需要剔除含缺失值的样本？]

## 1. 核心任务与强制规则
1. **任务目标**：明确此技能需要解决的核心问题，例如：进行因果推断、面板数据回归等。
2. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略（严格遵守）
1. **StatsPAI 首选原则与绝对 API 路径**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **绝对 API 调用**：为了防止 API 幻觉，必须使用明确的绝对导入路径。
   - [在此处明确列出必须调用的具体 `statspai` 函数签名，如 `from statspai.iv import npiv`，并列出必须的参数。]
   - **前置检验与高级估计**：[在此处补充要求：如适用，必须先执行相关的前置检验（如 LM 检验、平行趋势检验等），再执行高级估计模型。]
   - **标准化报告**：优先调用 `statspai` 对象的 `.summary()` 或 `.to_markdown()` 生成结果，确保输出严谨专业。

2. **专业学术可视化 (Professional Plots)**：在生成任何图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   - [在此处明确必须绑定的专有画图函数，如 `.plot()`、`moran_plot` 或相关可视化工具，禁止模型自行用原生 matplotlib 绘制简陋图表。]

3. **智能修复 (Self-Repair)**：如果在执行回归或分析时触发异常（如共线性、矩阵不可逆等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。

4. **Fallback 稳健机制**：如果调用 `statspai` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，利用原生的第三方库（如 `linearmodels`, `statsmodels`, `scikit-learn`）编写稳健的分析代码，切勿陷入死循环。

## 3. 结果输出要求
- [在此处定义最终回复给用户时的 Markdown 表格规范，如“必须包含系数、标准误、t值、p值”等。]
- 所有的图表必须保存为图片并向用户展示（推荐 `dpi=300`）。
