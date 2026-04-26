# Commercial Web App MVP: Architecture Cleanup & Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 梳理混乱的项目结构，将根目录下的独立前端代码完整迁移并替换 `deer-flow/frontend`，同时清理杂散文件，完成前后端联调适配，确保“项目干净”且能够正常启动商业化网页。

**Architecture:** 
- 创建 `archive/` 目录统一存放不再需要的文档、测试脚本和压缩包。
- 移除原有的 `deer-flow/frontend`。
- 将根目录下的 Vite/React 前端代码（包括 `src/`, `public/`, `package.json`, `vite.config.ts`, `tailwind.config.js` 等）整体移动到 `deer-flow/frontend`。
- 修改 `deer-flow/frontend/vite.config.ts` 增加对后端 API (`http://localhost:8001`) 的代理。
- 修改 `deer-flow/scripts/serve.sh` 以适配基于 Vite 的新前端启动命令。

**Tech Stack:** React, Vite, TailwindCSS, Node.js, Python (Backend)

---

### Task 1: 归档杂散文件与测试脚本

**Files:**
- Create: `archive/`
- Move: `*.gz`, `*.zip`, `test_*.py`, `summarize.py`, `update_*.py`, 零散 `.md` (非核心 README)

- [ ] **Step 1: 创建 archive 目录并移动压缩包**
```bash
mkdir -p archive/data archive/docs archive/scripts
mv 2026统计建模.gz 数据搜集.gz 文献.gz _dt_source.zip deeptrace-datacollector-v2.0-complete.zip archive/data/ || true
```

- [ ] **Step 2: 移动临时测试脚本与零散文档**
```bash
mv test_deerflow.py test_spatial.py summarize.py update_config.py update_uploads_config.py archive/scripts/ || true
mv 异常处理设计.md 恒生数据API技能设计文档.md 恒生数据API模块化总结.md 实证论文统计图.docx archive/docs/ || true
```

- [ ] **Step 3: 验证归档结果**
运行 `ls -la archive/` 确认文件已成功移入，根目录变干净。

---

### Task 2: 替换与迁移前端代码

**Files:**
- Remove: `deer-flow/frontend/` (旧版)
- Move: `src/`, `public/`, `package.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `tsconfig.json`, `index.html`, `vite-env.d.ts`, `App.tsx`, `main.tsx`, `index.css`, `components.json` -> `deer-flow/frontend/`

- [ ] **Step 1: 删除旧前端**
```bash
rm -rf deer-flow/frontend
mkdir -p deer-flow/frontend
```

- [ ] **Step 2: 移动新前端核心目录与配置文件**
```bash
mv src public package.json package-lock.json vite.config.ts tailwind.config.js postcss.config.js eslint.config.js tsconfig.json index.html components.json deer-flow/frontend/ || true
mv vite-env.d.ts App.tsx main.tsx index.css deer-flow/frontend/ || true
```

- [ ] **Step 3: 验证迁移结果**
运行 `ls -la deer-flow/frontend/` 确认 Vite 项目结构完整（应包含 src, public, package.json, vite.config.ts 等）。

---

### Task 3: 适配前端 Vite 配置与代理

**Files:**
- Modify: `deer-flow/frontend/vite.config.ts`

- [ ] **Step 1: 修改 Vite 配置以支持后端 API 代理及指定端口**
修改 `deer-flow/frontend/vite.config.ts` 中的 `server` 配置：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 2: 安装依赖并测试构建**
```bash
cd deer-flow/frontend && npm install && npm run build
```

---

### Task 4: 适配后端启动脚本 (serve.sh)

**Files:**
- Modify: `deer-flow/scripts/serve.sh`

- [ ] **Step 1: 修改 serve.sh 中的前端启动命令**
将 `serve.sh` 中设置 `FRONTEND_CMD` 的部分修改为 Vite 兼容的命令，同时修改环境变量设置逻辑。
在 `deer-flow/scripts/serve.sh` 中找到如下部分并替换：

```bash
# Frontend command
if $DEV_MODE; then
    FRONTEND_CMD="npm run dev -- --port 3000"
else
    FRONTEND_CMD="npm run build && npm run preview -- --port 3000 --host 0.0.0.0"
fi
```
（如果原来使用了 pnpm，也可以保持使用 `pnpm run dev -- --port 3000`）

- [ ] **Step 2: 修改 `serve.sh` 中的环境变量同步逻辑 (可选)**
将 `ENV_KEY="NEXT_PUBLIC_LANGGRAPH_BASE_URL"` 修改为 `ENV_KEY="VITE_LANGGRAPH_BASE_URL"` 以防 Vite 过滤掉它。

- [ ] **Step 3: 验证启动脚本语法**
```bash
bash -n deer-flow/scripts/serve.sh
```

---

### Task 5: 验证端到端启动与清理结果

**Files:**
- Execute: `make dev-daemon` in `deer-flow/`

- [ ] **Step 1: 启动服务**
```bash
cd deer-flow && make dev-daemon
```

- [ ] **Step 2: 检查服务状态**
```bash
curl -I http://localhost:3000
```
Expected: HTTP 200 OK (Vite 服务响应)

- [ ] **Step 3: 检查后端 API 连通性**
```bash
curl -I http://localhost:8001/health || echo "API Check"
```

- [ ] **Step 4: 提交架构变更**
```bash
git add archive/ deer-flow/frontend/ deer-flow/scripts/serve.sh
git commit -m "chore: migrate commercial frontend to deer-flow/frontend and cleanup root directory"
```