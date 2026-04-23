---
name: DeepTrace-SciPlot
description: 科研绘图技能。生成学术论文级高清统计图表。强制优先使用 StatsPAI 库，无法满足时使用 matplotlib/seaborn。
dependency:
  python:
    - matplotlib
    - seaborn
---

# DeepTrace-SciPlot 科研绘图

## 任务目标
一键生成符合国内外核心期刊规范的高清统计图表（散点图、折线图、热力图、箱线图等）。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：优先检查 `statspai` 库中是否有对应的可视化封装函数并调用。
2. **Fallback 稳健机制**：若无，使用 `matplotlib` 和 `seaborn` 进行绘制。要求：设置高分辨率 (dpi=300)、学术字体、去除无用的边框、使用色盲友好的学术配色。
3. **输出**：在沙盒中执行绘图脚本，保存图片并向用户展示。