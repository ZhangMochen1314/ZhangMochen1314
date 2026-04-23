---
name: DeepResValue-BioMR
description: 提供生信分析与孟德尔随机化(MR)功能，支持基于GWAS汇总数据的因果推断、多效性/异质性检验及漏斗图/散点图绘制。
dependency:
  python:
    - pandas
    - numpy
    - scipy
---

# DeepResValue-BioMR 孟德尔随机化生信分析

## 核心任务与强制规则
1. **意图澄清与数据预检 (Data Validation & Clarification)**：
   - 收到 GWAS 汇总数据后，**必须先在沙盒中执行探针脚本**（如 `pd.read_csv().head()`）探查数据结构。
   - 孟德尔随机化依赖于标准的 GWAS 列名。**必须主动检查**数据中是否包含必需的列，并主动向用户确认：
     - 哪个是**暴露因子效应值 (beta_xg)** 和 **标准误 (se_xg)**？
     - 哪个是**结局因子效应值 (beta_yg)** 和 **标准误 (se_yg)**？
     - 是否包含 **SNP ID**（如 rsid）和**效应等位基因 (effect allele)**？
   - 如果数据中包含了 p 值，**必须主动询问**用户：“是否需要我帮您根据 p 值阈值（如 $5 \times 10^{-8}$）和连锁不平衡（LD）进行工具变量的初步筛选？”
2. **任务目标**：处理全基因组关联分析（GWAS）汇总数据，使用孟德尔随机化方法推断暴露与结局之间的因果关系。
2. **禁止捏造**：严禁大模型编造函数名、SNP 数据或回归结果。必须严格执行代码获取真实估计。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **基础 MR 估计**：`from statspai.mendelian.mr import mr_ivw, mr_egger`。必须提取 GWAS 数据的 `beta_xg`, `beta_yg`, `se_xg`, `se_yg` 传入函数。
   - **多变量 MR**：`from statspai.mendelian.multivariable import mr_multivariable`。
   - **敏感性与诊断检验**：`from statspai.mendelian.diagnostics import mr_heterogeneity, mr_pleiotropy_egger`。用于进行异质性和水平多效性检验。
   - **智能修复 (Self-Repair)**：如果在执行回归或分析时触发异常（如 SNP 数量不足、数据格式错误），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。
   - **标准化报告**：优先调用返回对象（如 `MRResult`）的 `.summary()` 或 `.to_markdown()` 生成分析结果，确保输出格式严谨。

2. **专业学术可视化 (Professional Plots)**：在生成 MR 结果图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   随后，优先调用 MR 结果对象的 `.plot()` 方法（如果支持）或利用 `statspai.plots`，分别生成**散点图 (Scatter Plot)** 和 **漏斗图 (Funnel Plot)**。

3. **Fallback 稳健机制**：如果 `statspai.mendelian` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，利用原生 `statsmodels` 和 `scipy.stats` 编写 IVW（逆方差加权）和 MR-Egger 稳健回归代码，切勿陷入死循环。

## 结果输出要求
- 必须输出包含多种 MR 估计方法（如 IVW, MR-Egger, Weighted Median）的 Markdown 对照表，列出效应值 (OR/Beta)、95% 置信区间及 p 值。
- 必须输出 Cochran's Q 异质性检验结果和 MR-Egger 截距项多效性检验结果。
- 所有的图表必须保存为图片并向用户展示（推荐 `dpi=300`）。