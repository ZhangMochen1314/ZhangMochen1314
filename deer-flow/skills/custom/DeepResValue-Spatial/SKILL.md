---
name: DeepResValue-Spatial
description: 空间计量经济学技能。计算空间权重矩阵，进行探索性空间数据分析(ESDA)，并估计 SAR/SEM/SDM 及地理加权回归模型(GWR)。
dependency:
  python:
    - pandas
    - geopandas
    - libpysal
    - spreg
---

# DeepResValue-Spatial 空间计量分析

## 核心任务与强制规则
1. **任务目标**：处理带有地理或空间信息的数据，计算空间权重矩阵，并执行空间自回归模型(SAR)、空间误差模型(SEM)及空间杜宾模型(SDM)等高级空间计量估计。
2. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 执行策略（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用 `statspai` 库**。
   - **空间权重矩阵 (Weights)**：`from statspai.spatial.weights.distance import knn_weights, distance_band` 或 `from statspai.spatial.weights.contiguity import queen_weights`。
   - **探索性空间数据分析 (ESDA)**：计算全局莫兰指数使用 `from statspai.spatial.esda.moran import moran`。必须传入 `y` (因变量) 和 `w` (权重矩阵对象)。
   - **空间回归模型 (ML & GMM)**：使用极大似然估计 `from statspai.spatial.models.ml import sar, sem, sdm` 或 GMM估计 `from statspai.spatial.models.gmm import sar_gmm`。需传入 `data`, `formula`, `w` (权重矩阵)。
   - **空间效应分解 (Impacts)**：计算直接效应、间接效应与总效应，必须调用 `from statspai.spatial.models.impacts import impacts`，传入上一步的回归结果对象。
   - **地理加权回归 (GWR)**：如果用户要求 GWR，请使用 `from statspai.spatial.gwr.gwr import gwr`。
   - **智能修复 (Self-Repair)**：如果在构建矩阵或执行回归时触发了共线性或孤岛节点等异常，请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。
   - **标准化报告**：优先调用返回对象（如 `SpatialStatistic`, 各种 ML 模型结果）的 `.summary()` 或 `.to_markdown()` 生成分析报告。

2. **专业学术可视化 (Professional Plots)**：在生成莫兰散点图或其他空间相关图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```

3. **Fallback 稳健机制**：如果 `statspai.spatial` 报错或遇到库暂未支持的功能，智能体必须**自动回退**，利用原生 `libpysal`、`esda` 和 `spreg` 库编写稳健的 Python 估计脚本。

## 结果输出要求
- 必须输出莫兰指数 (Moran's I) 检验的 Z 值和 p 值。
- 回归结果必须输出学术标准的 Markdown 表格，包含系数、标准误、t 值、p 值。
- 若使用了 SAR 或 SDM，**必须强制输出包含直接效应 (Direct Effect)、间接效应/溢出效应 (Indirect Effect) 和总效应 (Total Effect) 的分解表格**。
- 若生成莫兰散点图，必须保存为高分辨率图片展示（`dpi=300`）。