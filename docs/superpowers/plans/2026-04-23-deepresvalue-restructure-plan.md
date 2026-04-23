# DeepResValue Project Restructuring & Export Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `StatsPAI` 移入智能体目录使其内聚，修改展示层（前端、文档）名称为 `DeepResValue`，并生成可直接下载的备份压缩包，以便用户本地留档。

**Architecture:**
- **StatsPAI Migration:** 将 `/workspace/StatsPAI` 移动到 `/workspace/deer-flow/StatsPAI`，并修改 `deer-flow/backend/pyproject.toml` 中的依赖路径，运行 `uv sync` 使依赖重新链接。
- **Rebranding:** 在 `deer-flow/frontend/index.html` 及主要界面中，将标题 "DeerFlow" 修改为 "DeepResValue"。
- **Packaging:** 在根目录下执行 `tar` 打包命令，排除 `node_modules`、`.venv` 等大体积且不需要的生成目录，仅压缩 `deer-flow` 文件夹供用户下载。

**Tech Stack:** Bash (tar, mv), Python (uv), React (Vite/HTML)

---

### Task 1: Migrate StatsPAI to Agent Directory

**Files:**
- Move: `/workspace/StatsPAI` -> `/workspace/deer-flow/StatsPAI`
- Modify: `/workspace/deer-flow/backend/pyproject.toml`

- [ ] **Step 1: Move the StatsPAI directory**
```bash
mv /workspace/StatsPAI /workspace/deer-flow/StatsPAI
```

- [ ] **Step 2: Update dependency path in pyproject.toml**
Modify `deer-flow/backend/pyproject.toml`. Look for `[tool.uv.sources]` and change the path from `../../StatsPAI` to `../StatsPAI`.
*Note: If you use SearchReplace, ensure the path reflects the new relative location from `deer-flow/backend` to `deer-flow/StatsPAI`.*

```toml
[tool.uv.sources]
statspai = { path = "../StatsPAI" }
deerflow-harness = { workspace = true }
```

- [ ] **Step 3: Sync Python dependencies**
```bash
cd /workspace/deer-flow/backend && uv sync
```
Expected: Output showing successful sync/resolution of packages without path errors.

- [ ] **Step 4: Commit changes**
```bash
git add /workspace/deer-flow/StatsPAI /workspace/deer-flow/backend/pyproject.toml
git commit -m "refactor: move StatsPAI into agent directory and update paths"
```

---

### Task 2: Rebrand Display Name to "DeepResValue"

**Files:**
- Modify: `/workspace/deer-flow/frontend/index.html`
- Modify: `/workspace/deer-flow/README.md`
- Modify: `/workspace/deer-flow/frontend/package.json`

- [ ] **Step 1: Update index.html Title**
Modify `deer-flow/frontend/index.html`. Find `<title>DeerFlow</title>` and replace it with `<title>DeepResValue</title>`.

- [ ] **Step 2: Update Frontend Package Name**
Modify `deer-flow/frontend/package.json`. Change `"name": "deer-flow-frontend"` to `"name": "deepresvalue-frontend"`.

- [ ] **Step 3: Update README**
Modify `deer-flow/README.md`. Change the main `# DeerFlow` header to `# DeepResValue` and add a brief note that the underlying structure remains `deer-flow` for compatibility.

- [ ] **Step 4: Search and replace in main App (if applicable)**
```bash
# Verify if there's any hardcoded "DeerFlow" in App.tsx or main.tsx
grep -ri "DeerFlow" /workspace/deer-flow/frontend/src/
# Use SearchReplace to replace "DeerFlow" with "DeepResValue" in the found files (e.g., App.tsx headers).
```

- [ ] **Step 5: Commit changes**
```bash
git add /workspace/deer-flow/frontend /workspace/deer-flow/README.md
git commit -m "style: rebrand display names to DeepResValue"
```

---

### Task 3: Create Clean Backup Archive

**Files:**
- Create: `/workspace/DeepResValue_WebApp_Backup.tar.gz`

- [ ] **Step 1: Clean temporary and cache files to reduce size**
```bash
cd /workspace/deer-flow
make stop || true
rm -rf backend/.pytest_cache backend/__pycache__ StatsPAI/.pytest_cache StatsPAI/__pycache__
```

- [ ] **Step 2: Create the tarball excluding heavy directories**
```bash
cd /workspace
tar -czvf DeepResValue_WebApp_Backup.tar.gz \
  --exclude="deer-flow/frontend/node_modules" \
  --exclude="deer-flow/backend/.venv" \
  --exclude="deer-flow/StatsPAI/.venv" \
  --exclude="deer-flow/.git" \
  --exclude="deer-flow/backend/.deer-flow/checkpoints*" \
  deer-flow/
```
Expected: A `.tar.gz` file is created in the `/workspace` directory containing the full cohesive webapp.

- [ ] **Step 3: Verify archive contents**
```bash
tar -tf /workspace/DeepResValue_WebApp_Backup.tar.gz | grep -E "node_modules|\.venv" || echo "Clean archive created successfully."
```
Expected output: "Clean archive created successfully." (No node_modules or .venv listed).