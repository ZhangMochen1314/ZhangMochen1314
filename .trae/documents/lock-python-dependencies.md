# 固定 Python 依赖与禁止动态安装包 Plan

## 1. 总结 (Summary)
- **固定依赖版本**：将所有 `pyproject.toml` 中的版本依赖符号（如 `>=`、`^`、`<`）替换为严格等于（`==`），固定在当前项目要求的具体版本，防止未来意外更新。
- **禁止分析时动态安装**：移除数据分析脚本（`analyze.py`）中在缺少包时自动执行 `pip install` 的 fallback 逻辑。
- **沙盒安全强化**：在沙盒命令审计中间件中，将所有与包安装相关的命令（如 `pip install`）从“中危（警告并放行）”升级为“高危（彻底拦截）”，从系统层面杜绝 Agent 尝试安装新包。

## 2. 当前状态分析 (Current State Analysis)
- 项目中有三个主要的依赖配置文件：
  - `backend/pyproject.toml`
  - `backend/packages/harness/pyproject.toml`
  - `StatsPAI/pyproject.toml`
  上述文件当前使用 `>=` 来定义最低版本，甚至存在 `<` 上限约束。这在长时间运行中如果环境重建，可能会拉取到存在破坏性更新的新版本。
- 数据分析脚本 `skills/public/data-analysis/scripts/analyze.py` 中包含 `try...except ImportError` 块，如果找不到 `duckdb` 或 `openpyxl`，会使用 `subprocess.run([sys.executable, "-m", "pip", "install", ...])` 动态安装。
- 沙盒安全中间件 `backend/packages/harness/deerflow/agents/middlewares/sandbox_audit_middleware.py` 将 `re.compile(r"pip3?\s+install")` 归类在 `_MEDIUM_RISK_PATTERNS` 中，这允许 Agent 执行该命令并仅附加一条警告。

## 3. 提议的变更 (Proposed Changes)

### 3.1 锁定 `pyproject.toml` 依赖版本
- **文件**：`backend/pyproject.toml`
  - **修改内容**：将所有 `>=` 替换为 `==`，并删除 `<` 相关的版本上限（如 `langgraph>=1.0.6,<1.0.10` 改为 `langgraph==1.0.6`）。
- **文件**：`backend/packages/harness/pyproject.toml`
  - **修改内容**：同上，锁定所有 `dependencies` 和 `optional-dependencies` 为固定版本。
- **文件**：`StatsPAI/pyproject.toml`
  - **修改内容**：同上，锁定所有 `dependencies` 和 `optional-dependencies` 为固定版本。

### 3.2 移除数据分析脚本中的动态安装逻辑
- **文件**：`skills/public/data-analysis/scripts/analyze.py`
  - **修改内容**：删除使用 `subprocess.run` 执行 `pip install` 的 `try...except` 块。直接保留 `import duckdb` 和 `import openpyxl`。如果环境中未预装这些包，脚本将直接抛出正常的 `ImportError`，强迫运行环境必须在构建阶段（如 Dockerfile 或 requirements.txt 中）固定好这些依赖。

### 3.3 拦截 Agent 的 `pip install` 行为
- **文件**：`backend/packages/harness/deerflow/agents/middlewares/sandbox_audit_middleware.py`
  - **修改内容**：
    1. 从 `_MEDIUM_RISK_PATTERNS` 中移除 `re.compile(r"pip3?\s+install")`。
    2. 在 `_HIGH_RISK_PATTERNS` 中添加 `re.compile(r"pip3?\s+install")`。
    3. 在 `_HIGH_RISK_PATTERNS` 中额外添加 `re.compile(r"python.*-m\s+pip\s+install")`，以防止 Agent 绕过直接的 `pip` 命令调用模块执行安装。

## 4. 假设与决策 (Assumptions & Decisions)
- **假设 1**：当前 `pyproject.toml` 中指定的最低版本（即 `>=` 右侧的版本号）是系统当前已验证且可用的版本。直接锁定为该版本即可满足“固定为当前版本”的要求。
- **决策 1**：完全切断 Agent 通过 bash 或 Python subprocess 动态获取新包的能力，以保障运行环境的高度一致性和安全性。
- **假设 2**：`duckdb` 和 `openpyxl` 会在构建/部署阶段由管理员或部署脚本预先安装好，不再依赖运行时的动态补充。

## 5. 验证步骤 (Verification steps)
- 检查上述 3 个 `pyproject.toml`，确认不存在 `>=`、`^`、`<` 或 `~=` 符号。
- 检查 `analyze.py`，确认不再包含任何 `subprocess.run` 或 `os.system` 与 `pip` 相关的调用。
- 检查 `sandbox_audit_middleware.py`，确认 `pip install` 的正则已在 `_HIGH_RISK_PATTERNS` 列表中。