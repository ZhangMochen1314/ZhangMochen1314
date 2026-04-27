# DeepResValue (原 DeerFlow) 更新日志

## [v1.0.0] - 2026-04-23

### 🚀 新特性与技能重构 (Skills Alignment)
本次更新全面重构了后端智能体技能，与前端界面需求实现了一一对应，并启用了统一的命名规范：
- **`DeepResValue-Literature-Search` (文献检索)**: 
  - 强制联网获取真实中文文献（如知网、万方），包括原文链接与摘要。
  - 默认抓取 **30篇** 核心期刊。
  - 废弃 HTML 模板，仅输出结构化的 Markdown 格式文献列表。
- **`DeepResValue-Literature-Review` (文献综述)**: 
  - 将原文献模块一分为二，此模块专职负责基于检索结果或用户上传内容，撰写高水准学术 Markdown 综述报告。
- **数据分析系列技能新增与重命名** (均搭载强制优先使用 `StatsPAI`、必要时回退原生 Python 的双保险机制):
  - `DeepResValue-DataClean` (数据清洗)
  - `DeepResValue-DID` (双重差分)
  - `DeepResValue-SciPlot` (科研绘图)
  - `DeepResValue-Spatial` (空间计量)
- **遗留技能整合与重命名**:
  - `DeepResValue-DataCollector` (原 `deeptrace-datacollector`)
  - `DeepResValue-StatModel` (原 `DeepTrace-statmodel`，2026建模大赛指导)

### 🛠 架构化重构与内聚性提升
- **项目更名**: 将所有用户展示层（如前端界面、README、技能配置）统一更名为 **DeepResValue**。为了保持系统底层兼容性，底层文件夹依然保留 `deer-flow` 的命名。
- **StatsPAI 迁移**: 将原本散落在根目录的 `StatsPAI` 项目移动到了 `deer-flow/StatsPAI`，并成功更新了 `pyproject.toml` 中的本地依赖路径，实现了真正的微服务单体化（Monorepo）内聚结构。
- **前端合并**: 将基于 Vite/React 的商业化网页应用成功迁移到了 `deer-flow/frontend/`，并配置了相应的启动脚本和反向代理，实现了全栈一键启动（`make dev-daemon`）。
- **空间净化**: 在根目录归档清理了大量遗留压缩包和测试脚本，保持了项目根目录的整洁。

### 📦 打包与备份机制
- 新增了 `export_project.sh` 一键打包脚本，能够自动清理开发缓存并排除 `.venv`、`node_modules` 等大体积目录，生成供本地留档的 `DeepResValue_WebApp_Backup.tar.gz`。