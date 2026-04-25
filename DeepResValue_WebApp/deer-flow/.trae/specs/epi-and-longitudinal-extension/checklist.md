# Verification Checklist

- [x] `/workspace/deer-flow/skills/custom/DeepResValue-TimeSeries/SKILL.md` 存在，且包含了 `statspai.timeseries.var.var` 等函数的明确 API 签名和时间频率的预检环节。
- [x] `/workspace/deer-flow/skills/custom/DeepResValue-Diagnostics/SKILL.md` 存在，且包含了 `statspai.diagnostics.sensemakr.sensemakr` 等函数的明确 API 签名和处理变量与基准控制变量的澄清预检。
- [x] `/workspace/deer-flow/skills/custom/DeepResValue-Epi/SKILL.md` 存在，且包含了 `target_trial.emulate.emulate`, `survival.aft.aft`, `survival.causal_forest.causal_survival_forest` 等前沿函数的 API 签名，并对生存数据格式（如 `duration`/`event`）有严格预检。
- [x] 上述所有技能的配置均明确包含了 `statspai.plots.set_theme('academic')` 全局主题设定要求，以及对于结果图表（如 IRF 脉冲响应图、等高线图、K-M 曲线等）的专业可视化输出指令。
- [x] 上述所有技能配置均包含了利用 `statspai.agent.remediation.REMEDIATIONS` 进行异常自我修复的兜底指令。