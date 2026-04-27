# Tasks
- [x] Task 1: 数据库多租户改造。更新 `backend/app/auth/models.py`，为 `User` 和 `SessionState` 增加 `tenant_id`。创建 `File` 和 `AnalysisTask` 模型并生成数据库迁移脚本。
- [x] Task 2: 租户中间件。在 `backend/app/middleware/tenant.py` 中实现 `TenantMiddleware`，提取 JWT/Headers 中的租户 ID 并注入 `request.state`。
- [x] Task 3: OSS 文件管理器。在 `backend/packages/harness/deerflow/sandbox/aliyun_fc/oss_manager.py` 中实现 `OSSManager`，封装 `oss2` 操作（上传、下载、预签名 URL）。
- [x] Task 4: FC 执行器函数 (Python)。编写部署到函数计算的 `index.py`。该函数需要能够接收大模型的任意 Shell/Python 命令，在 `/tmp` 中挂载并执行，通过环境变量与 OSS 同步执行前后文件的差异。
- [x] Task 5: 阿里云 FC 沙盒适配器。在 `backend/packages/harness/deerflow/sandbox/aliyun_fc/fc_sandbox.py` 中实现 `AliyunFCSandbox`，必须完整继承并实现 `deerflow.sandbox.sandbox.Sandbox` 中的所有 7 个抽象方法（`execute_command`, `read_file`, `write_file`, `list_dir`, `glob`, `grep`, `update_file`）。
- [x] Task 6: 后端文件上传 API。开发 FastAPI 路由，生成预签名上传 URL，并在前端直传 OSS 后确认文件状态。
- [x] Task 7: 前端文件上传组件。开发 `FileUpload.tsx` React 组件，实现多格式验证、获取预签名 URL 并上传文件至 OSS。

# Task Dependencies
- [Task 5] 依赖于 [Task 3] 和 [Task 4]
- [Task 7] 依赖于 [Task 6]