# Verification Checklist

- [x] `skills/custom/DeepResValue-Spatial/SKILL.md` 中包含了 `spatial_panel`（空间面板模型）的 API 签名和参数说明（如 `entity`, `time`, `effects="twoways"`）。
- [x] `skills/custom/DeepResValue-Spatial/SKILL.md` 中包含了 `lm_tests`（拉格朗日乘数检验组合）的调用方式。
- [x] `skills/custom/DeepResValue-Spatial/SKILL.md` 中明确了绘制莫兰散点图和 LISA 聚类图必须调用 `moran_plot` 和 `lisa_cluster_map`（而非从零拼凑 matplotlib 代码）。
- [x] `skills/custom/DeepResValue-Spatial/SKILL.md` 中包含了空间双重差分 (`spatial_did`) 和空间工具变量 (`spatial_iv`) 的高级特性指引。