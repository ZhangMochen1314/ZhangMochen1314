---
name: DeepResValue-EmpiricalSelector
description: 专门用于实证分析的变量筛选器，结合大模型语义分析与统计显著性检验（p-value），从原始数据中智能选出符合研究主题且显著的核心解释变量。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
    - matplotlib
    - seaborn
---

# DeepResValue-EmpiricalSelector 核心变量与控制变量智能筛选

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：
   - 必须明确询问用户的 **被解释变量（因变量 $Y$）**。
   - 必须明确询问用户的 **核心解释变量（自变量 $X$）**。
   - 必须明确询问用户的 **研究主题（Research Theme）**，例如“研究数字化转型对企业创新的影响”。
   - 若用户需求模糊，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
3. **数据约束检查 (Data Constraints)**：
   - 自动识别并处理包含缺失值（NaN）的行。
   - 自动识别非数值型变量并尝试转换为虚拟变量或在回归中剔除。

## 1. 核心任务与强制规则
1. **任务目标**：解决实证分析中变量过多、不知如何挑选的问题。通过双重过滤机制（语义 + 统计）筛选出最优的核心解释变量与控制变量组合。
2. **双重过滤策略与约束**：
   - **保证核心解释变量显著**：最终的模型必须保证核心解释变量在统计上显著（$p < 0.1$）。
   - **控制变量数量约束**：必须自动挑选出 5 到 10 个控制变量组合（即控制变量不少于 5 个，不多于 10 个）。
   - **控制变量无需全部显著**：脚本会自动挑选能够让核心变量显著的控制变量组合，控制变量本身是否显著不作强制要求。
   - **步骤 A（大模型语义过滤）**：作为大模型，你需要先基于数据列的名称或数据字典，结合用户的研究主题，在你的思考过程中挑选出一个宽泛的**候选控制变量列表（如 15-20 个语义相关的变量）**。
   - **步骤 B（统计显著性过滤）**：将核心变量和候选控制变量列表传入 `variable_selector.py` 脚本中，脚本会自动搜寻出符合上述约束的最佳变量组合。
3. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取结果。
4. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略（严格遵守）
1. **调用脚本过滤**：在生成 Python 分析代码时，必须调用自带的 `variable_selector.py` 脚本。
   - 绝对 API 调用示例：
     ```python
     import pandas as pd
     from skills.custom.DeepResValue_EmpiricalSelector.scripts.variable_selector import select_significant_variables, generate_markdown_report

     df = pd.read_csv("user_data.csv")
     candidate_controls = ["control1", "control2", "control3", "control4", "control5", "control6", "control7", "control8"] # 由你根据语义选出的尽可能多的候选控制变量
     y_var = "target_y"
     core_var = "core_x"

     # 执行筛选，脚本会自动寻找 5-10 个让 core_var 显著的控制变量组合
     result_df, plot_path = select_significant_variables(
         df=df, 
         y_var=y_var, 
         core_var=core_var, 
         candidate_controls=candidate_controls, 
         p_value_threshold=0.1,
         min_controls=5,
         max_controls=10
     )
     
     # 打印报告
     report = generate_markdown_report(result_df, y_var, plot_path)
     print(report)
     ```
2. **专业学术可视化 (Professional Plots)**：
   - 脚本内已内置相关性热力图或显著性图的生成逻辑。确保最终展示生成的图片路径。
   
3. **智能修复 (Self-Repair)**：如果在执行回归或分析时触发异常（如共线性、奇异矩阵等），请自动捕获异常，剔除共线性的变量并重试。

## 3. 结果输出要求
- 最终回复给用户时，必须提供包含“保留的变量（核心与控制）、回归系数、标准误、t值、p值”的 Markdown 表格。
- 必须根据核心变量的回归系数，结合用户的研究主题，给出 1-2 段简短的**经济学逻辑解读**。
- 展示生成的图片（例如相关性热力图）。
