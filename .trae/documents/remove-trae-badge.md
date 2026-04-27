# 移除前端 Trae Solo 标识徽章计划

## 摘要 (Summary)
根据用户要求，需要将前端项目中用于在右下角注入“Trae Solo”徽章的插件 `vite-plugin-trae-solo-badge` 彻底删除，以保证界面的纯净和符合定制化需求。

## 现状分析 (Current State Analysis)
目前该徽章插件主要在两个地方被引用：
1. `frontend/package.json`：作为开发依赖（`devDependencies`）被安装。
2. `frontend/vite.config.ts`：被导入并在 `plugins` 数组中被调用，配置了在生产环境（`prodOnly: true`）的右下角显示。

## 建议变更 (Proposed Changes)

### 1. 修改 `frontend/vite.config.ts`
- **操作**:
  - 移除顶部的导入语句：`import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';`
  - 移除 `plugins` 数组中的 `traeBadgePlugin({...})` 调用块。

### 2. 修改 `frontend/package.json`
- **操作**:
  - 在 `devDependencies` 对象中，删除 `"vite-plugin-trae-solo-badge": "^1.0.0"` 这一行。

### 3. 清理依赖 (执行指令)
- **操作**:
  - 在 `frontend/` 目录下执行 `npm uninstall vite-plugin-trae-solo-badge` 或直接重新运行 `npm install` 以更新 `package-lock.json`。

## 假设与决策 (Assumptions & Decisions)
- **决策**: 这是一个纯净的清理任务，直接删除相关的配置和依赖即可，不会对核心业务逻辑（如状态管理、路由、API 代理）造成任何破坏性影响。

## 验证步骤 (Verification Steps)
- 运行 `cd frontend && npm run build`，确保 Vite 打包过程不会因为找不到插件而报错。
- （可选）运行 `npm run preview` 检查生产环境构建的页面右下角，确认 Trae Solo 徽章已彻底消失。