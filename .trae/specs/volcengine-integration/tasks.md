# Tasks
- [x] Task 1: 修复核心安全漏洞
  - [x] SubTask 1.1: 全局搜索并删除测试文件与代码中的硬编码 `DEEPSEEK_API_KEY`（如 `sk-6544c9d8df82467bb60e3d6e9cb1476c` 等），更新 `.env.example`。
  - [x] SubTask 1.2: 修改 `jwt_utils.py`，移除 `SECRET_KEY` 默认值 `super-secret-key-for-dev`，缺失时抛出异常。
  - [x] SubTask 1.3: 修改 `deps.py`，移除默认 SQLite 数据库配置，缺失 `DATABASE_URL` 时抛出异常。
  - [x] SubTask 1.4: 修改 `uploads.py`，增加文件上传限制：最大 100MB，仅允许指定后缀（.csv, .xlsx, .xls, .dta, .sav, .sas7bdat, .pdf, .doc, .docx, .zip, .shp, .geojson, .txt, .md, .json）。
  - [x] SubTask 1.5: 修改 `config.yaml`，设置 `allow_host_bash: false`。

- [x] Task 2: 抽象对象存储接口并实现 TOSProvider
  - [x] SubTask 2.1: 在 `backend/app/storage` 下定义抽象基类 `StorageProvider`（含上传、下载、预签名URL、删除、列出文件等异步方法）。
  - [x] SubTask 2.2: 修改 `oss_provider.py` 继承并实现 `StorageProvider`。
  - [x] SubTask 2.3: 创建 `tos_provider.py`，使用 `tos` (火山引擎 SDK) 实现 `StorageProvider`。
  - [x] SubTask 2.4: 修改存储工厂或依赖注入逻辑，根据配置动态选择 provider。

- [x] Task 3: 实现 Volcengine 云沙箱后端
  - [x] SubTask 3.1: 查阅火山引擎 API 文档，理解 veFaaS/云沙箱 签名及调用方式。
  - [x] SubTask 3.2: 在 `aio_sandbox` 下创建 `VolcengineSandboxBackend` 类，继承自现有沙箱基类。
  - [x] SubTask 3.3: 实现创建 (`create`)、销毁 (`destroy`)、存活检测 (`is_alive`) 及发现 (`discover`) 等方法。

- [x] Task 4: 实现会话持久化管理
  - [x] SubTask 4.1: 创建 `SessionState` 数据类和 `SessionManager` 类。
  - [x] SubTask 4.2: 实现对 Redis 的会话读写逻辑。
  - [x] SubTask 4.3: 实现与 TOS 的快照保存和恢复逻辑。
  - [x] SubTask 4.4: 集成会话管理器至业务流程。

- [x] Task 5: 更新配置及文档
  - [x] SubTask 5.1: 更新 `config.yaml` 补充 TOS、沙箱及会话持久化配置。
  - [x] SubTask 5.2: 更新 `.env.example`，补充所需的所有环境变量。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2]