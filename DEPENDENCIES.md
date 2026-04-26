# DeepResValue Python 核心依赖清单

以下是 DeepResValue 系统（尤其是底层数据分析库 `StatsPAI` 和网关后端）所必需的 Python 核心依赖包。您在部署时可确保环境包含这些依赖。

## 1. 数据分析引擎 (StatsPAI)
此模块负责执行实际的科研数据分析（描述性统计、回归、因果推断等）。

**支持的 Python 版本**: `>=3.9`

**核心依赖列表**:
- `numpy >= 1.20.0, < 2.0.0`
- `pandas >= 1.3.0`
- `scipy >= 1.7.0`
- `statsmodels >= 0.13.0`
- `linearmodels >= 4.25`
- `numba >= 0.56.0`
- `scikit-learn >= 1.0.0`
- `patsy >= 0.5.0`
- `openpyxl >= 3.0.0` (用于 Excel 处理)
- `xlsxwriter >= 3.0.0` (用于 Excel 导出)
- `python-docx >= 1.0.0` (用于 Word 报告导出)
- `tabulate >= 0.9.0` (用于 Markdown 表格渲染)

*(可选附加包)*：
- `duckdb` (若您需要进行 SQL 分析)

---

## 2. 后端主网关 (Backend Gateway)
负责提供 API 接口、WebSocket 流式推断以及用户会话管理。

**支持的 Python 版本**: `>=3.12`

**核心依赖列表**:
- `fastapi >= 0.115.0`
- `uvicorn[standard] >= 0.34.0`
- `httpx >= 0.28.0`
- `python-multipart >= 0.0.26`
- `sse-starlette >= 2.1.0`
- `aliyun-oss2` (阿里云 OSS SDK，部署云端时必须)
- `aliyun-fc2` (阿里云函数计算 SDK，部署云端时必须)

*(内部包引用)*：
- `statspai` (必须引用自项目内)
- `deerflow-harness` (大模型中间件，必须引用自项目内)

---

## 3. 大模型代理中间件 (DeerFlow Harness)
大模型驱动、LangGraph 图管理、工具调用与沙盒拦截的核心引擎。

**支持的 Python 版本**: `>=3.11`

**核心依赖列表 (部分节选)**:
- `langgraph >= 1.0.6, < 1.0.10`
- `langchain >= 1.2.3`
- `langchain-anthropic >= 1.3.4`
- `langchain-deepseek >= 1.0.1`
- `langchain-openai >= 1.1.7`
- `langfuse >= 3.4.1` (用于模型监控)
- `agent-sandbox >= 0.0.19` (用于 Python 沙盒代码执行)
- `markitdown[all,xlsx] >= 0.0.1a2`
- `markdownify >= 1.2.2`

---

**环境隔离建议**: 
在云端服务器（如 ECS）部署时，强烈建议使用 Python 3.12 虚拟环境（`python3 -m venv venv`）统一安装上述包，其中 `StatsPAI` 中的依赖会自动向下兼容 Python 3.12。