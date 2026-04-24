# SaaS 商业化升级执行计划

## 摘要
本计划旨在将现有的开源版 DeerFlow 升级为具备商业闭环的企业级 SaaS 应用。根据用户的业务需求和执行顺序指令，开发将严格按照以下顺序执行：
1. **阶段四（高阶科研文件解析）**
2. **阶段三（阿里云 OSS 云存储直传）**
3. **阶段一（用户管理与认证体系接入 PostgreSQL）**

## 当前状态分析
- **基础设施**：用户已在阿里云部署 ECS (118.178.171.55) 和 RDS PostgreSQL (pgm-bp1k62jy6sis7n7s.pg.rds.aliyuncs.com)。
- **应用架构**：FastAPI 后端 + React 前端。当前状态持久化基于 SQLite/JSON，尚未接入关系型数据库 ORM。
- **文件系统**：目前采用本地文件存储，不支持 `.zip` 解压，未集成 `.dta`、`.sav` 和 `.shp` 格式的智能解析。
- **用户体系**：目前无用户登录注册页面，所有 API 处于无鉴权状态。

## 假设与决策
- **数据库**：利用用户已购买的阿里云 RDS PostgreSQL，引入 `SQLAlchemy` (异步) 进行数据建模，用于存储用户凭证及账单。
- **文件转换**：文件解析和转换操作在后端执行。`.shp` 文件的解析引入 `geopandas`，`.dta`/`.sav` 文件的解析引入 `pyreadstat`，以提取科研数据特有的变量标签（Variable Labels）。
- **云存储**：引入 `aliyun-oss2` SDK，改造现有的 `uploads.py` 路由。为了节省 ECS 实例的公网带宽，前端将采用 OSS 预签名直传（Presigned URL）的方式直接与阿里云对象存储交互。

---

## 执行步骤 (Proposed Changes)

### 阶段四：高阶科研文件解析管道 (Data Pipeline)
**目标**：扩展文件上传的解析能力，深度支持科研界常用的 `.zip`, `.sav`, `.dta`, `.shp` 文件格式，并提取关键元数据供大模型理解。

- **依赖修改**：
  - `backend/pyproject.toml`：添加 `pyreadstat` (SPSS/Stata) 和 `geopandas` (GIS 空间数据) 依赖。
- **代码修改**：
  - 修改 `backend/packages/harness/deerflow/utils/file_conversion.py`：
    - 新增 `extract_and_flatten_zip()` 逻辑，安全递归解压 `.zip` 文件，并将其内部文件重新注入解析管道。
    - 新增 `parse_statistical_data()` 逻辑，拦截 `.sav` 和 `.dta` 格式，调用 `pyreadstat` 提取数据字典（包含变量名、变量标签、值标签），生成 Markdown 数据摘要。
    - 新增 `parse_shapefile()` 逻辑，拦截 `.shp` 格式（通常打包在 zip 中），调用 `geopandas` 读取并生成空间边界（Bounding Box）和属性表结构的 Markdown 摘要。
- **验证步骤**：上传一个包含 `.sav` 和 `.shp` 的 `.zip` 压缩包，检查后端是否成功解压，并在 Agent 的上下文中正确生成这些格式的 Markdown 数据字典和摘要。

### 阶段三：云存储 (阿里云 OSS) 与文件直传
**目标**：彻底改造现有的本地文件存储机制，利用阿里云 OSS 提升存储上限并节约服务器带宽。

- **依赖修改**：
  - `backend/pyproject.toml`：添加 `oss2` 依赖。
- **代码修改**：
  - 新建 `backend/app/storage/oss_provider.py`：封装生成 OSS 预签名 URL 的核心逻辑。
  - 修改 `backend/app/gateway/routers/uploads.py`：
    - 废弃原先的本地文件流写入逻辑。
    - 改造 `POST /api/threads/{thread_id}/uploads` 接口，使其接收前端的文件元数据（文件名、大小），并返回一组允许前端直接 `PUT` 到 OSS 的预签名 URL。
  - 修改 `frontend/src/pages/Chat.tsx`：
    - 改造上传组件交互，获取预签名 URL 后，使用 `fetch` 或 `axios` 以 `PUT` 方法将文件直传至阿里云 OSS。
    - 上传成功后，向后端发送确认请求，由后端进行 Markdown 转换和沙盒路径映射。
- **验证步骤**：在前端上传一个大文件，通过浏览器网络面板确认文件流直接发往 `aliyuncs.com` 域名，且 ECS 磁盘不再产生大量占用。

### 阶段一：多租户与鉴权体系 (User Auth)
**目标**：引入 RDS PostgreSQL，建立标准的登录/注册体系和 JWT (JSON Web Token) 接口鉴权，实现多租户数据隔离。

- **依赖修改**：
  - `backend/pyproject.toml`：添加 `sqlalchemy`, `asyncpg`, `passlib[bcrypt]`, `pyjwt`, `python-multipart`。
- **代码修改（后端）**：
  - `backend/app/gateway/app.py`：在 FastAPI 的 `lifespan` 生命周期中，初始化异步 PostgreSQL 数据库引擎。
  - 新建 `backend/app/auth/models.py`：使用 SQLAlchemy 定义 `User` 表（包含 ID, username, email, hashed_password, credits）。
  - 新建 `backend/app/auth/jwt_utils.py`：实现密码哈希、JWT Token 生成与验证工具类。
  - 新建 `backend/app/auth/router.py`：实现 `/api/auth/register` 和 `/api/auth/login` 端点。
  - 修改 `backend/app/gateway/deps.py`：添加 `get_current_user` 依赖项，用于解析 Request Header 中的 Bearer Token。
  - 修改 `backend/app/gateway/routers/*.py`：在 `/threads`, `/memory` 等核心业务接口中注入 `get_current_user` 依赖，实现权限拦截与数据隔离。
- **代码修改（前端）**：
  - 新建 `frontend/src/pages/Login.tsx` 和 `frontend/src/pages/Register.tsx`：开发美观的登录与注册表单。
  - 修改 `frontend/src/store/useAuthStore.ts`：集成 Zustand 状态管理，持久化存储 Token 和用户信息。
  - 修改 `frontend/src/App.tsx`：配置全局路由守卫（Route Guard），未登录状态下强制重定向至 `/login`。
- **验证步骤**：未登录访问首页会自动跳转至登录页；完成注册和登录后，获得 JWT Token，后续所有聊天与上传请求均携带此 Token 并成功通过后端校验。