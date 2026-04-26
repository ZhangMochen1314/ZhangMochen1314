# DeepResValue (formerly DeerFlow): Restructuring & Export Design

## Purpose
用户当前的开发重点是整理出一个**完整、干净的商业化网页应用**（包含前端和后端智能体），并将其打包保存到本地作为备份。
目前的痛点是：
1. `StatsPAI` 路径不在智能体目录内，导致项目内聚性差。
2. 智能体的名称在展示层（前端、文档）中仍然是 "deerflow" 或 "DeerFlow"，而应该变更为 **DeepResValue**。
3. 根目录还散落着其他不相关的项目（如 `data-collection/`, `literature-extract/`），导致“项目结构太混乱”，不利于用户直接打包备份这个网页应用。

本次设计的目标是：
1. **结构内聚**：将 `StatsPAI/` 移动到 `deer-flow/backend/` 下（或 `deer-flow/` 下），修改对应的 Python 依赖路径（`pyproject.toml` 等）。
2. **名称更新（展示层）**：将 `deer-flow/frontend/` 中的标题、Logo 文本、README 以及相关的展示文本统一修改为 `DeepResValue`（采用正确的拼写）。不修改底层文件夹名称 `deer-flow` 以保持构建稳定。
3. **一键备份准备**：提供一个打包脚本或说明，帮助用户忽略掉 `node_modules`, `.venv`, `.git` 以及根目录下无关的文件夹，只把 `deer-flow`（包含前端、后端和 StatsPAI）打包成一个干净的压缩包。

## Architecture & Changes

### 1. StatsPAI 路径调整
- **当前路径**：`/workspace/StatsPAI/`
- **目标路径**：`/workspace/deer-flow/StatsPAI/`
- **受影响的配置**：
  - `deer-flow/backend/pyproject.toml`：原本依赖 `statspai = { path = "../../StatsPAI" }`，需要修改为 `statspai = { path = "../StatsPAI" }`。
  - 需要在后端执行 `uv sync` 更新依赖锁。

### 2. 展示层重命名为 "DeepResValue"
- **前端部分 (`deer-flow/frontend/`)**：
  - `index.html`：修改 `<title>` 为 `DeepResValue`。
  - 核心组件（如 `App.tsx` 或 Navbar）：将所有出现的 `DeerFlow` 文本替换为 `DeepResValue`。
  - `package.json`：`"name": "deepresvalue-frontend"`。
- **文档部分 (`deer-flow/`)**：
  - `deer-flow/README.md`：更新标题和简介。

### 3. 备份打包方案 (Export)
为了帮助用户保存到本地，我们将在根目录生成一个 `export_project.sh` 脚本，或者直接运行命令：
```bash
# 排除不必要的依赖目录，只打包核心的 webapp
tar -czvf DeepResValue_WebApp.tar.gz \
  --exclude="deer-flow/frontend/node_modules" \
  --exclude="deer-flow/backend/.venv" \
  --exclude="deer-flow/backend/__pycache__" \
  --exclude="deer-flow/StatsPAI/.pytest_cache" \
  deer-flow/
```
用户下载此压缩包即可获得一个纯净的、内聚的前后端应用。

## Scope Check
- [x] 将 StatsPAI 移入智能体目录。
- [x] 修改前端和文档展示名为 DeepResValue。
- [x] 准备一个干净的打包文件供用户下载备份。
- [x] 不改动底层文件夹名 `deer-flow`（按用户确认的意图）。
