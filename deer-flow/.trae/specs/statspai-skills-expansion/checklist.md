# Verification Checklist

- [x] `DeepResValue-IV` 的 SKILL.md 存在，包含 `statspai.iv` 模块的核心函数签名（`ivdml`, `npiv`, `kleibergen_paap_rk` 等），并规定了 Markdown 表格输出。
- [x] `DeepResValue-Mediation` 的 SKILL.md 存在，包含 `statspai.mediation.mediate.mediate` 及 `four_way_decomposition` 等 API，并规定了自然直接效应/间接效应的置信区间输出。
- [x] `DeepResValue-Panel` 的 SKILL.md 存在，包含 `statspai.panel.feols.feols` 与 `interactive_fe` 的参数说明（如固定效应和聚类），及 Hausman 检验输出。
- [x] `DeepResValue-BioMR` 的 SKILL.md 存在，明确使用 GWAS 数据（`beta_xg`, `beta_yg` 等），包含 `mr_ivw`、`mr_egger` 以及异质性/多效性检验，并强制要求 `.plot()` 输出漏斗图/散点图。
- [x] 所有上述技能均强制包含了 `statspai.plots.set_theme('academic')` 和 `use_chinese()` 的全局主题设置。
- [x] 所有的技能均明确了对应的 Fallback 机制（如果 `statspai` 无法覆盖，该如何使用 `linearmodels`, `statsmodels` 等进行替代）。
- [x] 所有技能都内置了 `statspai.agent.remediation.REMEDIATIONS` 异常自修复提示。
- [x] `skills/custom/SKILL_TEMPLATE.md` 规范模板已建立，为未来技能扩展提供标准。