# Tasks
- [x] Task 1: 后端（backend）静态代码分析与测试执行
  - [x] SubTask 1.1: 运行 ruff 检查代码规范与错误
  - [x] SubTask 1.2: 运行 pytest 执行现有单元测试
  - [x] SubTask 1.3: 审查 backend/app/ 目录下的核心路由和业务逻辑，确认错误处理完整性

- [x] Task 2: 前端（frontend）静态代码分析
  - [x] SubTask 2.1: 运行 eslint 检查前端代码错误
  - [x] SubTask 2.2: 运行 tsc 检查 TypeScript 类型错误

- [x] Task 3: StatsPAI 模块分析与测试执行
  - [x] SubTask 3.1: 运行 ruff 等代码规范检查
  - [x] SubTask 3.2: 运行 pytest 执行 StatsPAI 单元测试
  - [x] SubTask 3.3: 审查 StatsPAI 核心算法代码是否处理了关键的边界条件

- [x] Task 4: 生成审计报告
  - [x] SubTask 4.1: 汇总 Task 1、Task 2 和 Task 3 的检查结果，形成最终的 `audit_report.md`

# Task Dependencies
- [Task 4] depends on [Task 1], [Task 2], [Task 3]