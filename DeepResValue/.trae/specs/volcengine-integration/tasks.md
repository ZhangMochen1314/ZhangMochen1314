# Tasks

## Phase 1: 立即安全修复 (Security Hotfixes)
- [x] Task 1.1: 移除硬编码 API Key。查找 `.env` 文件和 `test_deepseek*.py` 系列测试代码，删除类似 `sk-7cdd...` 和 `sk-6544...` 的明文密钥，改为通过 `os.environ` 注入。
- [x] Task 1.2: 创建 `.env.example` 模板文件。包含 `VOLCENGINE_ACCESS_KEY`、`VOLCENGINE_TOS_BUCKET`、`DATABASE_URL`、`JWT_SECRET_KEY` 等必填配置项示例。
- [x] Task 1.3: 修复 JWT 密钥安全漏洞。修改 `backend/app/auth_utils.py` (或对应鉴权文件) 中 `JWT_SECRET_KEY` 的读取逻辑，移除 `super-secret-key-for-dev` 等弱口令默认值，若环境变量未设置则直接抛出启动异常。
- [x] Task 1.4: 修复数据库配置安全。移除 `backend/app/gateway/deps.py` 中的默认 SQLite 连接字符串，若 `DATABASE_URL` 未设置则抛出异常，并在 `.env.example` 中说明如何配置 PostgreSQL 连接。
- [x] Task 1.5: 增加文件上传大小与类型限制。在 `backend/app/gateway/routers/uploads.py` 中添加 100MB (`104857600` 字节) 大小上限和扩展名白名单（`.csv, .xlsx, .xls, .dta, .sav, .sas7bdat, .pdf, .doc, .docx, .zip, .shp, .geojson, .txt, .md, .json`），并在接收文件流时校验。
- [x] Task 1.6: 禁用本地宿主机命令执行。将 `config.yaml` 中的 `allow_host_bash` 设为 `false`。

## Phase 2: 存储接口抽象与火山引擎 TOS 集成
- [x] Task 2.1: 定义 `StorageProvider` 抽象基类。在 `backend/app/storage/` 目录下创建包含异步的 `upload_file`, `download_file`, `generate_presigned_url`, `delete_file`, `list_files` 等方法的抽象类。
- [x] Task 2.2: 重构现有的 `OSSProvider`。使其继承并实现 `StorageProvider` 接口。
- [x] Task 2.3: 实现 `TOSProvider` 模块。使用火山引擎 Python SDK (`tos`) 对接对象存储，并确保兼容 `StorageProvider` 接口规范。
- [x] Task 2.4: 优化存储系统配置。更新配置文件，使预签名 URL 过期时间不再硬编码为 3600 秒，并支持动态选择存储提供商 (`tos` 或 `oss`)。

## Phase 3: 沙箱接口抽象与火山引擎 veFaaS 集成
- [x] Task 3.1: **【调研步骤】** 使用 `agent-browser` 技能或网络搜索，查阅火山引擎云沙箱 (veFaaS) 的官方 API 文档，确定创建、执行、销毁沙箱和认证方式（V4 签名算法）的调用规范。
- [x] Task 3.2: 抽象 `SandboxBackend` 接口类。梳理 `create`, `destroy`, `is_alive`, `discover`，以及执行代码、上传下载文件等核心方法，确保原有 Local/Remote SandboxBackend 兼容。
- [x] Task 3.3: 实现 `VolcengineSandboxBackend` 类。封装与火山引擎云沙箱的 HTTP API 交互或 SDK 调用，并在 `config.yaml` 中配置沙箱选择器。
- [x] Task 3.4: 优化沙箱机制控制。在调用获取沙箱实例的过程中，添加 30 秒的超时控制机制，防止程序因云端延迟无限阻塞。

## Phase 4: 会话持久化与进阶功能 (Session Persistence)
- [x] Task 4.1: 创建 `SessionState` 数据类。定义会话元数据结构（会话ID、用户ID、关联沙箱ID、最后活跃时间、用户变量及代码执行历史等）。
- [x] Task 4.2: 创建 `SessionManager` 类并集成三层存储架构。利用 Redis 缓存当前活跃状态（24小时），利用 PostgreSQL 持久化操作日志，利用 TOS 存储会话的大型数据集快照。
- [x] Task 4.3: 编写数据库迁移及表结构代码。在 SQLAlchemy ORM 中添加会话元数据和操作日志的存储表。
- [x] Task 4.4: 集成到业务逻辑中。修改现有 API 路由和 Agent 生命周期，实现会话中断后的进度恢复机制。
- [x] Task 4.5: 扩展数据格式支持。在数据分析技能或文件读取模块中，增加对 SAS 格式 (`.sas7bdat`) 的解析支持（通过 `pandas.read_sas()`）。

# Task Dependencies
- [Phase 2] depends on [Phase 1]
- [Phase 3] depends on [Phase 1]
- [Phase 4] depends on [Phase 2] and [Phase 3]