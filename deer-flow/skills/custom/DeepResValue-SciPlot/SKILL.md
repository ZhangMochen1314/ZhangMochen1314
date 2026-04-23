---
name: DeepResValue-SciPlot
description: 科研绘图技能。生成学术论文级高清统计图表。强制优先使用 StatsPAI 库，无法满足时使用 matplotlib/seaborn。
dependency:
  python:
    - matplotlib
    - seaborn
---

# DeepResValue-SciPlot 科研绘图

## 任务目标
一键生成符合国内外核心期刊规范的高清统计图表（散点图、折线图、热力图、箱线图等）。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成绘图代码时，**必须优先使用 `statspai.plots` 模块**：
   - **全局学术主题**：在绘图前，必须调用 `from statspai.plots import set_theme, use_chinese`，并执行 `set_theme('academic')` 和 `use_chinese()` 以确保图表符合学术期刊规范并支持中文字体。
   - **Binned Scatter Plot**：如果是绘制分组散点图（Binscatter），请直接使用 `from statspai.plots import binscatter`。
2. **Fallback 稳健机制**：如果 `statspai.plots` 中暂未提供某种特定的图表类型（如复杂热力图、网络图等），智能体必须**自动回退**，使用原生的 `matplotlib.pyplot` 或 `seaborn` 进行绘制，但依然要保持 `set_theme('academic')` 的全局样式。
3. **输出**：生成高分辨率（建议 dpi=300）的图片文件，并在沙盒中展示或供用户下载。