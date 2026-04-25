# Tasks
- [x] Task 1: 数据库连接池与依赖拆分
  - [x] SubTask 1.1: 在 `backend/app/gateway/deps.py` 中引入 `AUTH_DATABASE_URL` 环境变量配置。
  - [x] SubTask 1.2: 创建 `auth_engine` 和 `auth_session_maker`。
  - [x] SubTask 1.3: 实现 `get_auth_db` 异步生成器函数。
  - [x] SubTask 1.4: 更新 `backend/.env.example` 文件，增加 `AUTH_DATABASE_URL` 的示例配置。

- [x] Task 2: 路由层数据库依赖切换
  - [x] SubTask 2.1: 将 `backend/app/auth/router.py` 中所有的 `Depends(get_db_session)` 替换为 `Depends(get_auth_db)`。
  - [x] SubTask 2.2: 将 `backend/app/auth/deps.py`（如果存在，或者 `app/gateway/deps.py`）中用于获取当前用户的 `get_current_user` 的数据库依赖替换为 `get_auth_db`。
  - [x] SubTask 2.3: 在 `backend/app/billing/router.py` 中预留或引入 `Depends(get_auth_db)`。

- [x] Task 3: 应用启动与自动建表逻辑重构
  - [x] SubTask 3.1: 修改 `backend/app/gateway/app.py` 中的 `lifespan` 钩子。
  - [x] SubTask 3.2: 确保 `auth_engine.begin()` 执行 `Base.metadata.create_all()` 以便在新的自管数据库上建立 Auth & Billing 相关的表结构。
  - [x] SubTask 3.3: 编写或调整基础的数据库连接测试脚本，验证两个数据库连接的独立性。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]