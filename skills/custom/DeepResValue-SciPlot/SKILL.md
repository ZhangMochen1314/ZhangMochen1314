---
name: DeepResValue-SciPlot
description: 科研绘图技能。生成学术论文级高清统计图表。强制优先使用高质量科研图表模板库（支持学术/商业风格），并结合 StatsPAI 核心结果对象的原生绘图。
dependency:
  python:
    - matplotlib
    - seaborn
    - pandas
    - numpy
    - scipy
    - networkx
    - statsmodels
---

# DeepResValue-SciPlot 科研绘图

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户绘图数据后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：
   - 如果用户要求画图（如“画个分布图”、“画个社交网络图”），**必须主动询问**并确认用户期望的图表风格：
     - **学术风格 (Academic)**：适用于期刊论文、学术发表、黑白印刷。纯黑白灰配色，A4 黄金比例，无冗余装饰。
     - **商业风格 (Commercial)**：适用于 PPT 演讲、商业报告、海报展示。彩色高对比度，16:9 比例。
   - 若用户需求模糊或数据中缺少画图所需的关键变量（如 X 轴、Y 轴或分组变量），必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
3. **数据约束检查 (Data Constraints)**：根据不同图表类型（如面板分布、网络图节点/边），在绘图前显式清理缺失值 (NaN) 和进行格式转换。

## 1. 核心任务与强制规则
1. **任务目标**：一键生成符合国内外核心期刊规范或商业演示要求的高清统计图表（超过 18 种复杂图表，如断点回归图、小提琴图、中介效应图、脑影像激活图等）。
2. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实的图片。
3. **输出格式**：不要用 Markdown 输出长篇的画图代码块！**必须**在沙盒中执行绘图逻辑，直接将生成的真实图片绝对路径（如 `output_path`）通过 Markdown 图片语法 `![分析图](文件路径)` 返回并展示给用户。

## 2. 执行策略（严格遵守）
1. **最高优先级：调用系统内置高级绘图库 (`scientific_plotter.py`)**：
   - 系统已经内置了“最佳图表模板库”。当用户要求绘制通用科研图表（如分布图、网络图、回归散点图、潜类别图、中介/调节效应路径图等）时，**绝对优先调用内置工具**。
   - **绝对 API 调用**：
     ```python
     from scientific_plotter import generate_plot
     # plot_type 必须是内置支持的名称，如 'plot_distribution', 'create_did_plot', 'plot_social_network', 'plot_interaction' 等
     generate_plot(plot_type='plot_distribution', style='academic', output_path='/mnt/user-data/outputs/output_plot.png')
     ```
2. **StatsPAI 原生因果图表回退**：
   - 如果用户要求对特定的 `StatsPAI` 分析结果进行可视化（如 DID 平行趋势图、系数森林图等），**必须优先调用对应 `statspai` 结果对象的 `.plot()` 方法**（如 `CSReport.plot()`, `MRResult.plot()`）。

3. **专业学术可视化 (Professional Plots)**：在使用 `StatsPAI` 原生绘图或 Fallback 绘图时，**必须**调用全局主题设置：
   ```python
   import statspai as sp
   sp.set_theme('academic')  # 或 'commercial'
   sp.use_chinese()
   ```

4. **智能修复 (Self-Repair)**：如果在执行绘图时触发异常（如数据类型不匹配、索引越界等），请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息或自动改写数据结构并重试。

5. **Fallback 稳健机制**：如果内置模板库 `scientific_plotter` 不包含用户指定的特殊图表，且 `StatsPAI` 也无法满足，智能体必须**自动回退**，利用原生的 `matplotlib.pyplot` 或 `seaborn` 进行绘制，但依然要保持 `set_theme('academic')` 的全局样式。

## 3. 结果输出要求
- 直接展示高清图表图片：`![图表名称](/mnt/user-data/outputs/output_plot.png)`。
- 所有的图表必须保存为图片并向用户展示（推荐 `dpi=300`）。
- 可选附带图表的简短解读，避免输出冗长无用的代码实现细节。
