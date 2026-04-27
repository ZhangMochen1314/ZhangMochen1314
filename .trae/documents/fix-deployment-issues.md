# 修复部署脚本与同步配置 (Fix Deployment & Sync Issues)

## 摘要 (Summary)
针对 Coze 提出的三个反馈：
1. 代码目录结构未真正移动：由于服务器拉取旧版本或旧版脚本路径写死，导致感觉还在子目录中。
2. 迁移脚本路径错误：`migration_tenant.py` 写死了相对路径，导致未读取系统环境变量中的真实数据库文件路径。
3. GitHub 连接极慢：由于国内网络环境导致拉取代码超时，需提供镜像加速方案。

## 现状分析 (Current State Analysis)
- **Git 结构**：在之前的更新中，代码已经成功移动到仓库的根目录。但是 `scripts/update_from_git.sh` 里面仍保留着 `cd /var/www/deepresvalue/DeepResValue_WebApp/deer-flow` 这个陈旧路径，导致拉取报错或在旧目录下更新。
- **迁移脚本**：`backend/migration_tenant.py` 中写死了 `sqlite3.connect('deerflow.db')`，导致直接在当前目录下生成了一个空的 db 文件，而没有更新实际部署时使用 `DATABASE_URL` 指定的数据库。
- **网络问题**：国内服务器直接访问 GitHub 极易超时（Connection Timed Out）。

## 建议变更 (Proposed Changes)

### 1. 修改更新脚本目录与加入镜像加速
**文件**: `scripts/update_from_git.sh`
**修改内容**:
- 修改 `cd` 路径为项目根目录 `/var/www/deepresvalue/`（或自动适应当前目录）。
- 在执行 `git pull` 前，加入使用国内 GitHub 镜像站（如 `kkgithub.com` 或 `github.moeyy.xyz`）的临时替换逻辑，解决国内 ECS 服务器 `git pull` 连接超时的痛点。

### 2. 修复数据库迁移脚本的路径解析
**文件**: `backend/migration_tenant.py`
**修改内容**:
- 引入 `os` 模块，读取环境变量 `DATABASE_URL`。
- 如果存在 `DATABASE_URL`（例如 `sqlite:////var/www/deepresvalue/data/deepresvalue.db`），则解析出真实的绝对路径并连接。
- 否则回退为当前的 `deerflow.db` 作为本地开发兼容。

### 3. 向 Coze 的回复文案 (供用户转发)
制定一份给 Coze 的回复，说明最新的代码已经完全落位在根目录，并提供了脚本修复说明，以及如何进行镜像拉取。

## 假设与决策 (Assumptions & Decisions)
- 假设生产环境使用的是 SQLite（根据 Coze 反馈的绝对路径 `/var/www/deepresvalue/deer-flow/data/deepresvalue.db`），我们将在 `migration_tenant.py` 中针对 `sqlite:///` 前缀进行特殊解析处理。
- 采用直接修改 `.sh` 脚本的方式引入 `git config --global url...` 的 GitHub 镜像加速机制，保证用户不需要手动敲复杂命令即可完成顺畅更新。

## 验证步骤 (Verification Steps)
- 检查 `update_from_git.sh` 脚本中的路径和 git mirror 配置语法是否正确。
- 检查 `migration_tenant.py` 对环境变量解析的正则或字符串替换是否能提取正确的本地路径。