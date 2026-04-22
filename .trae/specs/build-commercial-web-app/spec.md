# Build Commercial Web App MVP Spec

## Why
大学生在进行科研、论文写作及国家级竞赛（如全国大学生统计建模大赛、正大杯等）时面临数据分析门槛高、难以复现等痛点。目前系统后端的 DeerFlow 2.0 结合 StatsPAI 已经具备可复现自动化数据分析的专业能力。本项目阶段的目标是将这些能力封装为商业化网页应用，并引入基于“积分”的商业化计费模式，解决大学生的痛点并实现项目商业落地与部署。

## What Changes
- **新增积分与计费系统 (Frontend)**：在前端应用中集成用户积分体系，包括积分展示、消耗提示与充值方案。
- **重构产品首页**：针对大学生群体优化文案与 UI，突出“科研辅助”、“国家级竞赛指导”、“可复现分析”等核心竞争力。
- **完善对话与数据集工作区**：集成完整的对话交互闭环，包含数据上传（消耗积分）、自动推荐分析方案、执行与图表渲染。
- **添加生产部署配置**：准备适用于前端静态资源部署的 Nginx 与 Docker 配置，为正式上线做准备。

## Impact
- Affected specs: 商业化落地、积分消费模式。
- Affected code:
  - 路由与状态管理：`src/store/useStore.ts`, `src/App.tsx`
  - 核心页面：`src/pages/Home.tsx`, `src/pages/Chat.tsx`, `src/pages/Datasets.tsx`
  - 部署文件：`Dockerfile`, `nginx.conf` 等。

## ADDED Requirements
### Requirement: 积分消费机制
The system SHALL provide 针对不同功能（如高级智能体调用、数据上传、生成专业报告）的积分扣减与查询机制。

#### Scenario: 成功发起数据分析并扣减积分
- **WHEN** 用户在对话区发起一次数据分析或上传数据集
- **THEN** 系统提示将消耗一定积分，并在请求发出后实时更新用户的剩余积分。

### Requirement: 针对大学生竞赛与科研的定制化首页
The system SHALL provide 针对大学生科研和竞赛（如统计建模大赛、正大杯）的宣传文案与定价方案。

#### Scenario: 浏览首页与定价方案
- **WHEN** 潜在用户访问首页
- **THEN** 用户能清晰看到可复现数据分析的核心卖点，以及基于积分的不同等级充值方案。

## MODIFIED Requirements
### Requirement: 对话区交互与渲染
目前的基础对话页面需要进一步完善，使其支持完整的 Markdown 分析报告渲染、复杂数据图表的动态展示，并集成积分扣减的拦截逻辑（如果积分不足则阻止分析请求）。
