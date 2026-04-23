# Verification Checklist

- [x] `/workspace/deer-flow/skills/custom/DeepResValue-Matching/SKILL.md` 存在，且包含了 `statspai.matching.match.match` 函数的明确 API 签名和意图澄清环节（询问 `distance` 与 `method`）。
- [x] `/workspace/deer-flow/skills/custom/DeepResValue-DML/SKILL.md` 存在，且包含了 `statspai.dml.double_ml.dml` 函数的明确 API 签名和基于处理变量类型自动选择 `model`（`plr` / `irm`）的机制。
- [x] 上述所有技能的配置均明确包含了 `statspai.plots.set_theme('academic')` 全局主题设定要求，以及对于结果图表（如倾向得分重叠图、协变量平衡图等）的专业可视化输出指令。
- [x] 上述所有技能配置均包含了利用 `statspai.agent.remediation.REMEDIATIONS` 进行异常自我修复的兜底指令。