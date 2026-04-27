# SaaS 架构与 FC 容器化集成 Spec

## 为什么 (Why)
DeepResValue 正在向可扩展的 SaaS 平台演进，需要实现多租户隔离、基于阿里云 OSS 的云端文件存储，以及基于阿里云函数计算 (FC) 的安全、可扩展代码执行环境。虽然 `Trae_Solo_Development_Guide_V1.md` 提供了初步指南，但其提供的 Sandbox 适配器代码和 FC 执行器为一次性执行模型，不符合 `deerflow2.0` 项目中 `Sandbox` 抽象类要求的有状态交互标准（如 `read_file`, `write_file`, `list_dir` 等）。我们需要修正这些设计以完美契合 `deerflow2.0` 的底层架构。

## 变更内容 (What Changes)
- **多租户数据库与中间件**: 
  - 在现有的 `User` 和 `SessionState` 等核心表中引入 `tenant_id`。
  - 新增 `File` 和 `AnalysisTask` 数据库模型。
  - 实现 `TenantMiddleware`，通过 JWT Token 或 Header 解析租户身份并进行全局隔离。
- **OSS 文件管理器**: 
  - 实现 `OSSManager`（基于 `oss2` SDK），管理租户隔离的文件路径（`tenants/{tenant_id}/...`），并支持生成预签名 URL。
- **阿里云 FC 沙盒适配器 (核心修正)**:
  - **BREAKING**: 创建 `AliyunFCSandbox`，必须继承自 `deerflow.sandbox.sandbox.Sandbox`。
  - 必须完整实现所有 7 个抽象方法：`execute_command`, `read_file`, `write_file`, `list_dir`, `glob`, `grep`, `update_file`。
  - *架构调整*: 文件操作方法（如 `read_file`, `write_file`）将直接通过 OSS API 读写云端存储。`execute_command` 将调用 FC。
- **FC 执行器函数 (状态同步版)**:
  - 修正指南中的单次执行逻辑。新的 FC 执行器在接收到命令时，需从 OSS 拉取当前任务的工作区文件，执行传入的 Bash/Python 命令，随后将变动的文件同步回 OSS，以模拟有状态的沙盒环境。
- **前端直传组件**:
  - 开发 `FileUpload` React 组件，实现“前端请求预签名 URL -> 浏览器直传 OSS -> 后端确认”的安全提效链路。

## 影响范围 (Impact)
- 影响的模块: 智能体沙盒执行层、文件存储系统、用户认证与权限控制。
- 影响的代码:
  - `backend/app/auth/models.py`
  - `backend/app/middleware/tenant.py` (新增)
  - `backend/packages/harness/deerflow/sandbox/aliyun_fc/` (新增)
  - `frontend/src/components/FileUpload.tsx` (新增)

## 新增需求 (ADDED Requirements)
### 需求: 多租户数据隔离
系统必须通过 `tenant_id` 在数据库查询、文件存储（OSS路径）和 API 访问级别实现严格的数据隔离。

#### 场景: 成功隔离
- **WHEN** 租户 A 的用户请求获取文件列表
- **THEN** 系统中间件自动拦截并仅返回 `tenant_id == A` 且属于该用户的文件，OSS 路径限定在 `tenants/A/` 下。

### 需求: 兼容 deerflow2.0 的云端执行
系统必须在阿里云 FC 中执行大模型生成的代码，且沙盒适配器必须完全实现 `Sandbox` 接口，对上层 Agent 表现为标准的本地环境。

## 修改的需求 (MODIFIED Requirements)
### 需求: 现有的本地沙盒执行
**原因**: 平台需要走向 SaaS 化，本地沙盒无法提供足够的并发隔离与安全性。
**迁移**: 原有的 `LocalSandbox` 将在云端部署时被替换为 `AliyunFCSandbox`，底层文件系统由本地磁盘迁移至 OSS。