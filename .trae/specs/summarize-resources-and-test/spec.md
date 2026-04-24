# 总结云账号资源与测试准备 Spec

## Why
用户已经完成了阿里云资源（ECS、RDS）购买以及 DeepSeek API 密钥的准备，需要将所有分散的凭据信息汇总成一个清单，方便后续测试及自动化部署操作。

## What Changes
- 汇总 ECS 公网 IP、登录用户名及密码。
- 汇总 RDS 内网连接地址、端口、数据库名、用户名及密码。
- 汇总 DeepSeek V4Pro 大模型 API Key 信息。
- 确认安全组 SSH（22）端口的放行状态，为接下来的自动化部署和联调测试做准备。

## Impact
- Affected specs: 商业化 SaaS 部署架构
- Affected code: 无直接代码修改，主要为环境初始化准备参数。

## ADDED Requirements
### Requirement: 资源汇总与联调测试准备
系统需以结构化的格式展示所有已购买的云端资源，并提供下一步的测试验证指引。

#### Scenario: Success case
- **WHEN** 用户需要查阅云资源详情并进入测试环节时
- **THEN** 系统清晰输出 ECS、RDS 和 API 密钥的完整清单，并执行或指导完成连通性测试。
