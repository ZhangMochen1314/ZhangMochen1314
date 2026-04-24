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

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
- 空间计量需要强依赖空间权重矩阵。如果用户只上传了数据文件（如 CSV/Excel）而未说明空间关系，**必须主动询问**用户：“您的空间权重矩阵打算如何构建？数据中是否包含地理坐标（经纬度），或者您是否能提供邻接矩阵文件/Shapefile？”
   - **严格的数据格式要求检查**：
     - 如果要计算**邻接权重** (`queen_weights`)，数据必须转为 `geopandas.GeoDataFrame` 且包含 `.geometry` 列。
     - 如果要计算**距离权重** (`knn_weights`)，必须从数据中提取坐标构成的 `numpy.ndarray` (形状为 N x 2)。
     - 如果要做**空间面板模型** (`spatial_panel`)，数据必须是长格式的 `pandas.DataFrame`，且**必须是强平衡面板（不允许有任何个体的年份缺失）**。智能体必须预先检查并提示用户缺失情况。
     - 传入 `spatial_panel` 的权重矩阵 `W` (尺寸 N x N)，其顺序必须与按个体名称/ID字母顺序排列后 (`sorted(df['entity'].unique())`) 的顺序**完全一致**。
   - 必须先查看并分析数据的前几行（通过 `pd.read_csv().head()`），确认因变量 (`y`) 和自变量 (`X`)。如果用户未明确指定模型设定，**必须主动询问**用户具体的回归公式设定。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：处理带有地理或空间信息的数据，计算空间权重矩阵，并执行空间自回归模型(SAR)、空间误差模型(SEM)及空间杜宾模型(SDM)等高级空间计量估计。
3. **禁止捏造**：严禁大模型编造函数名或数据结果。必须严格执行代码获取真实回归结果。
3. **输出格式**：**仅输出结构化的 Markdown (.md) 报告**及生成的专业可视化图表。

## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。
   - **空间权重矩阵 (Weights)**：`from statspai.spatial.weights.distance import knn_weights, distance_band` 或 `from statspai.spatial.weights.contiguity import queen_weights`。
   - **空间诊断 (Spatial Diagnostics)**：诊断非空间 OLS 是否存在空间误差或空间滞后，必须使用 `from statspai.spatial.models.diagnostics import lm_tests`。诊断残差空间相关性可使用 `moran_residuals`。
   - **探索性空间数据分析 (ESDA)**：计算全局莫兰指数使用 `from statspai.spatial.esda.moran import moran`。必须传入 `y` (因变量) 和 `w` (权重矩阵对象)。
   - **空间回归模型 (ML & GMM)**：处理截面数据时，使用极大似然估计 `from statspai.spatial.models.ml import sar, sem, sdm` 或 GMM估计 `from statspai.spatial.models.gmm import sar_gmm`。需传入 `data`, `formula`, `W` (权重矩阵)。
   - **空间面板模型 (Spatial Panel Models)**：处理面板数据时，**必须**使用 `from statspai.spatial.panel.estimator import spatial_panel`，需显式传入参数 `entity`（个体列名）, `time`（时间列名）, `model`（如 "sar", "sdm"）, 以及 `effects="twoways"` (双向固定效应) 或 `"fe"`。
   - **前沿空间模型 (Advanced Spatial Models)**：若用户要求评估包含空间溢出的政策效应，使用空间双重差分 `from statspai.spatial.did import spatial_did`；若存在内生性问题，使用空间工具变量估计 `from statspai.spatial.iv import spatial_iv`。
   - **空间效应分解 (Impacts)**：计算直接效应、间接效应与总效应，必须调用 `from statspai.spatial.models.impacts import impacts`，传入上一步的回归结果对象。
   - **地理加权回归 (GWR)**：如果用户要求 GWR，请使用 `from statspai.spatial.gwr.gwr import gwr`。
   - **智能修复 (Self-Repair)**：如果在构建矩阵或执行回归时触发了共线性或孤岛节点等异常，请通过正则表达式匹配异常栈，利用 `statspai.agent.remediation.REMEDIATIONS` 提供的诊断信息自动改写数据并重试。
   - **标准化报告**：优先调用返回对象（如 `SpatialStatistic`, 各种 ML 模型结果）的 `.summary()` 或 `.to_markdown()` 生成分析报告。

2. **专业学术可视化 (Professional Plots)**：在生成莫兰散点图、LISA 聚类图或其他空间相关图表前，**必须**调用全局主题设置：
   ```python
   from statspai.plots import set_theme, use_chinese
   set_theme('academic')
   use_chinese()
   ```
   - 绘制莫兰散点图时，**绝对优先调用** `from statspai.spatial.esda.plots import moran_plot`。
   - 绘制 LISA 聚类地图时，**绝对优先调用** `from statspai.spatial.esda.plots import lisa_cluster_map`，需传入 `y, w, gdf` 等参数（并可设置 `p_threshold`）。切勿使用 matplotlib 从零开始绘制散点或多边形渲染地图。

2. **容错与降级机制 (Fallback to Native Python)**：
   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，或者遇到库暂未支持的功能，你必须触发**平滑降级**：
   - **立即放弃使用 `statspai`**。
   - 转而使用原生的 `statsmodels`, `linearmodels`, 或 `scikit-learn` 编写稳健的备用代码。
   - 在向用户解释时，请礼貌地说明：“由于数据复杂性导致高级估计量无法收敛，我已自动为您切换到经典的备用模型进行评估。”

## 3. 结果输出要求
- 必须输出莫兰指数 (Moran's I) 检验的 Z 值和 p 值。
- 回归结果必须输出学术标准的 Markdown 表格，包含系数、标准误、t 值、p 值。
- 若使用了 SAR 或 SDM，**必须强制输出包含直接效应 (Direct Effect)、间接效应/溢出效应 (Indirect Effect) 和总效应 (Total Effect) 的分解表格**。
- 若生成莫兰散点图，必须保存为高分辨率图片展示（`dpi=300`）。
