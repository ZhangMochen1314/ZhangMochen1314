---
name: DeepResValue-[SkillName]
description: [Brief description of what this skill does, e.g., 提供工具变量分析、弱工具变量检验等高级计量经济学功能]
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
---

# DeepResValue-[SkillName] [中文名称]

## 核心任务与强制规则
1. **任务目标**：明确此技能需要解决的核心问题，例如：进行因果推断、面板数据回归等。
2. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **核心API调用**：[在此处明确列出大模型必须调用的具体 `statspai` 函数签名，如 `from statspai.iv import npiv`，并列出必须的参数。]
   - **智能修复 (Self-Repair)**：如果在执行回归或分析时触发异常（如共线性、矩阵不可逆等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。
   - **标准化报告**：优先调用 `statspai` 对象的 `.summary()` 或 `.to_markdown()` 生成结果，以确保输出格式严谨、专业。

2. **专业学术可视化 (Professional Plots)**：在生成任何图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   如果有专门的绘图函数（如 `.plot()` 或 `statspai.plots` 下的方法），优先使用。

3. **Fallback 稳健机制**：如果调用 `statspai` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，利用原生的第三方库（如 `linearmodels`, `statsmodels`, `scikit-learn`, `matplotlib`, `seaborn`）编写稳健的分析与绘图代码，切勿陷入死循环。

## 结果输出要求
- [在此处定义最终回复给用户时的 Markdown 表格规范，如“必须包含系数、标准误、t值、p值”等。]
- 所有的图表必须保存为图片并向用户展示（推荐 `dpi=300`）。