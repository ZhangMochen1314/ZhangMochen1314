# Tasks
- [ ] Task 1: 修复安全漏洞与配置文件（阶段一）：
  - [x] SubTask 1.1: 删除所有测试文件（如 `test_deepseek*.py`）和 `.env` 文件中的硬编码 API Key，补充完整的 `.env.example`。
  - [x] SubTask 1.2: 修改 `backend/app/auth/jwt_utils.py` 和 `backend/app/gateway/deps.py`，移除 JWT 的 `super-secret-key-for-dev` 及 SQLite 的默认值，未配置则抛出异常。
  - [x] SubTask 1.3: 在 `backend/app/gateway/routers/uploads.py` 增加 100MB 的文件大小上限和类型白名单校验。
  - [x] SubTask 1.4: 修改 `config.yaml`，将 `allow_host_bash` 设为 `false`。
- [ ] Task 2: 集成火山引擎对象存储（TOS）：
  - [x] SubTask 2.1: 在 `backend/app/storage/` 目录下抽象 `StorageProvider` 接口，并将现有的 `OSSProvider` 改为实现该接口。
  - [x] SubTask 2.2: 使用火山引擎官方 Python SDK，新增 `TOSProvider` 的实现类，实现上传、下载、预签名 URL 生成、删除和列表功能。
- [ ] Task 3: 集成火山引擎云沙箱后端（veFaaS）：
  - [ ] SubTask 3.1: 查阅官方文档确认认证签名、沙箱生命周期管理和代码执行的 API。
  - [ ] SubTask 3.2: 在 `backend/packages/harness/deerflow/community/aio_sandbox/` 下新增 `VolcengineSandboxBackend`，继承 `SandboxBackend` 并重写 `create`、`destroy`、`is_alive` 等方法，添加超时控制。
- [ ] Task 4: 构建会话持久化层（SessionManager）：
  - [ ] SubTask 4.1: 设计 `SessionState` 数据结构并生成基于 PostgreSQL 的 Alembic 数据库迁移脚本。
  - [ ] SubTask 4.2: 实现 `SessionManager` 类，统筹 Redis（24h 缓存）、PostgreSQL（永久操作日志）和 TOS（大数据快照）的存储调度。
  - [ ] SubTask 4.3: 在 `backend/app/gateway/routers/threads.py` 等业务路由中接入会话管理器逻辑。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3