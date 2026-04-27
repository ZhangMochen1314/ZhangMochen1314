# StatsPAI 科研技能全面扩充与专业集成规范 (Spec)

## 为什么 (Why)
`StatsPAI` 是一个功能极其强大的、专为因果推断和现代计量经济学设计的底层引擎，甚至内置了前沿的生信分析（孟德尔随机化）模块。然而，目前智能体仅接入了基础的数据清洗、DID 和空间计量，未能充分释放其全部潜力。我们需要系统性地根据应用场景开发常用科研技能（工具变量、机制检验、面板回归、生信分析等），并规范化其输入参数、调用函数及输出格式，以实现最专业的“Agent + StatsPAI”深度集成。

## 变更内容 (What Changes)
- **新增四大科研技能模块**：
  - `DeepResValue-IV`（工具变量与内生性检验）
  - `DeepResValue-Mediation`（机制检验与因果中介分析）
  - `DeepResValue-Panel`（高维面板回归与交互固定效应）
  - `DeepResValue-BioMR`（生信分析/孟德尔随机化）
- **建立统一的技能模板 (`SKILL_TEMPLATE.md`)**：强制规范所有技能必须包含核心 API 签名、必填参数说明、Markdown 报告格式以及可视化要求。
- **强化 `statspai.plots` 集成**：要求所有技能必须统一调用学术绘图模块，输出高分辨率专业图表。

## 影响范围 (Impact)
- 影响的组件：Agent 的技能配置 (`skills/custom/` 目录)。
- 影响的逻辑：大模型在处理特定计量/生信问题时的代码生成 Prompt 策略。

## 新增需求 (ADDED Requirements)

### 需求 1：工具变量技能 (Instrumental Variables)
系统应提供专业的 IV 估计与弱工具变量检验能力。
- **调用函数**：`statspai.iv.npiv`, `statspai.iv.ivdml`, `statspai.iv.weak_identification.kleibergen_paap_rk`
- **输入参数**：内生变量 (`endog`)，工具变量 (`instruments`)，外生控制变量 (`exog`)，数据 (`data`)。
- **输出结果**：两阶段最小二乘（或非参数/机器学习IV）回归结果 Markdown 表格，K-P 弱工具变量检验 F 值及判断结论。

### 需求 2：机制检验技能 (Mediation Analysis)
系统应支持基于反事实框架的现代因果中介分析。
- **调用函数**：`statspai.mediation.mediate.mediate`, `statspai.mediation.four_way.four_way_decomposition`
- **输入参数**：处理变量 (`d`)，中介变量 (`m`)，结果变量 (`y`)，协变量 (`x`)。
- **输出结果**：自然直接效应 (NDE)、自然间接效应 (NIE) 的点估计与 Bootstrap 置信区间，中介效应占比，敏感性分析可视化图表。

### 需求 3：面板回归技能 (Panel Regression)
系统应支持处理大型高维固定效应面板数据。
- **调用函数**：`statspai.panel.feols.feols`, `statspai.panel.interactive_fe.interactive_fe`
- **输入参数**：回归公式 (`formula`)，个体/时间固定效应 (`fixed_effects`)，聚类标准误 (`cluster`)。
- **输出结果**：吸收高维 FE 后的回归系数表，Hausman 检验/截面相关检验结论。

### 需求 4：生信分析/孟德尔随机化 (Bioinformatics / MR)
系统应支持基于 GWAS 汇总数据的因果推断。
- **调用函数**：`statspai.mendelian.mr.mr_ivw`, `statspai.mendelian.mr.mr_egger`, `statspai.mendelian.diagnostics.mr_heterogeneity`
- **输入参数**：暴露因子效应值 (`beta_xg`)，结局因子效应值 (`beta_yg`)，及对应的标准误 (`se_xg`, `se_yg`)。
- **输出结果**：IVW 与 MR-Egger 效应估计对照表，异质性/多效性检验结论，并调用 `.plot()` 输出散点图 (Scatter plot) 和漏斗图 (Funnel plot)。

### 需求 5：专业可视化集成 (Professional Visualization)
所有技能在输出前，**必须**调用：
```python
from statspai.plots import set_theme, use_chinese
set_theme('academic')
use_chinese()
```
确保所有图表（散点图、系数森林图、平行趋势图、漏斗图）达到核心期刊（如 AER 或 中文顶刊）的出版标准。

## 探索：如何更专业地将 StatsPAI 集成到智能体？
1. **沙盒上下文注入**：大模型无需“猜测”API，而是通过在沙盒执行 `help(statspai.iv)` 或 `statspai.registry.list_methods()` 动态获取最新的方法列表，实现“反向反射”。
2. **结构化错误自愈**：深度利用 `statspai.agent.remediation.REMEDIATIONS`，把异常信息转化为结构化的 LLM 修复指令。
3. **标准化报告对象**：所有的 `statspai` 模块返回的对象（如 `MRResult`, `DIDAnalysis`）应实现一个 `.to_markdown()` 或 `.summary()` 的标准方法，大模型只需调用该方法即可直接打印专业排版的文字报告，减少大模型自己拼凑表格导致的幻觉。