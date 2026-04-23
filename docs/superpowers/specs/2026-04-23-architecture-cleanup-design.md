# Commercial Web App MVP: Architecture & Migration Design

## Purpose
目前用户的商业化网页应用（基于 React/Vite 开发）散落在项目根目录下，而原有的 DeerFlow 2.0 系统包含其自带的前后端代码（位于 `deer-flow/` 中）。项目根目录下还混杂了大量历史文档、压缩包、测试脚本等，导致项目结构非常混乱。

本次设计的目标是：
1. **替换前端**：用根目录下的用户前端代码（商业化网页）完整替换掉 `deer-flow/frontend` 中的旧前端。
2. **清理架构**：将根目录下的杂散文件统一移入归档目录（如 `archive/`），保持根目录清爽。
3. **适配环境**：确保迁移后的新前端能够正常启动，其构建配置（Vite, Tailwind 等）和依赖不丢失，并与 DeerFlow 后端 API 路由及 CORS 完美对接。

## Architecture & Migration Plan

### 1. 前端代码替换与迁移
我们将使用根目录的商业化前端替换 `deer-flow/frontend`。
- **备份/移除旧前端**：删除或归档 `deer-flow/frontend`。
- **移动新前端**：将根目录下的前端核心文件与配置移入 `deer-flow/frontend`。
  - **核心目录**：`src/`, `public/`
  - **配置文件**：`package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `index.html` 等。

### 2. 后端 API 与路由适配
新前端移入 `deer-flow/frontend` 后，需要确保其与 DeerFlow 后端（`deer-flow/backend`）能够通信。
- **开发环境代理 (Proxy)**：在 `deer-flow/frontend/vite.config.ts` 中配置 proxy，将 `/api` 或特定请求转发到后端 Gateway (默认 `http://localhost:8001`)。
- **环境变量**：确保前端使用的 `VITE_API_BASE_URL` 等环境变量正确指向后端。
- **CORS 适配**：检查 `deer-flow/backend` 的 CORS 配置，确保允许前端域名的请求。
- **启动脚本更新**：DeerFlow 的 `Makefile` 和启动脚本（如 `serve.sh`）原本针对 Next.js，需要修改为适配 Vite (`npm run dev` 或 `npm run build && npm run preview`)。

### 3. 项目结构清理与归档
为了保证“项目干净”，我们将创建一个 `archive/` 目录，将根目录下不属于核心运行时的杂散文件移入其中。
- **待归档文件示例**：
  - 各类压缩包（`.gz`, `.zip`）
  - 临时测试脚本（`test_deerflow.py`, `summarize.py` 等）
  - 零散的设计文档（`*.md`, `.docx` 等，除非是核心 README）

## Addressing the "Missing Files" Concern
**Why did files and skills disappear?**
在云端沙盒或协作环境中，有时会发生由于环境重置、Git 切换分支、或由于在不同目录下工作导致的文件“消失”错觉。我们将通过以下步骤应对：
1. **彻底搜查**：在归档前，我们会全盘搜索关键的 `SKILL.md` 和您之前编写的配置文件，确保它们没有被意外删除，而是被放在了子目录（如 `literature-extract/` 或 `data-collection/`）中。
2. **统一管理**：通过这次的重构，我们将把所有技能（Skills）集中放到 `deer-flow/backend/skills/` 目录下，或者明确在文档中指明它们的路径，防止再次丢失。

## Proposed Final Structure (Subset)
```text
/workspace/
├── archive/                  <-- 所有旧的压缩包、零散文档和测试脚本
├── deer-flow/
│   ├── backend/              <-- 智能体后端（保持不变或做少量CORS调整）
│   ├── frontend/             <-- (NEW) 用户基于 Vite 的商业化前端
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── docker/               <-- 部署配置
│   ├── Makefile
│   └── README.md
├── StatsPAI/                 <-- 核心库
└── README.md                 <-- 顶级说明文档
```

## Next Steps
1. 执行清理操作：创建 `archive/` 并移动杂散文件。
2. 执行前端迁移：替换 `deer-flow/frontend`。
3. 更新配置：修改 `vite.config.ts`、`Makefile` 等以保证前后端联调正常。
