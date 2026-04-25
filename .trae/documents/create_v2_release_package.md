# 目标 (Goal)
将当前工作区 (`/workspace/deer-flow`) 的项目打包为一个新的压缩包（暂定命名为 `DeepResValue_WebApp_Release_v2.0.tar.gz`），并且在打包前在项目根目录下生成一份详细的更新日志文档 (`CHANGELOG_v2.md` 或 `README_UPDATE.md`)，详细说明相较于第一版 (`DeepResValue_WebApp_Release_v1.0.tar.gz`) 的更新内容。

# 当前状态分析 (Current State Analysis)
- 当前项目位于 `/workspace/deer-flow`，已经经过了多次迭代，包括引入 PostgreSQL、多租户鉴权、阿里云 OSS 支持、高阶科研文件解析等功能。
- 原始的第一版本位于 `/workspace/DeepResValue_WebApp_Release_v1.0.tar.gz`。
- 通过比对两个版本的差异，我们已经提取出了关键的新特性、架构调整和问题修复。

# 计划的更改 (Proposed Changes)
1. **生成更新日志文档**
   - **文件路径**: `/workspace/deer-flow/CHANGELOG_v2.0.md`
   - **内容**: 将比对结果整理成 Markdown 格式的更新日志，包含以下部分：
     - **New Features (新特性)**: 多租户鉴权、科研文件解析、阿里云 OSS 预签名上传。
     - **Architectural Changes (架构调整)**: 废弃旧的 `<citations>` 解析系统、统一使用 Markdown 链接、迁移至云原生部署拓扑。
     - **Fixes (问题修复)**: 技能重名冲突修复、增强 `/api/skills` 接口、精简 Artifact 下载逻辑。
2. **清理工作区 (可选)**
   - 在打包前，确保排除不必要的文件（如 `.venv`、`__pycache__`、`node_modules` 等临时文件或巨大的依赖文件夹），以减小压缩包体积。
3. **打包项目**
   - **命令**: 使用 `tar` 命令将 `/workspace/deer-flow` 目录打包。
   - **输出文件**: `/workspace/DeepResValue_WebApp_Release_v2.0.tar.gz`

# 假设与决策 (Assumptions & Decisions)
- **命名**: 假设新版本命名为 `v2.0`。如果用户有其他命名要求，可以在实施阶段修改。
- **排除规则**: 在打包时，决定使用 `--exclude` 参数排除常见的依赖和缓存文件夹，以保证源码包的纯净。
- **文档位置**: 更新日志文档直接放置在项目根目录 `/workspace/deer-flow/` 下，这样解压后第一眼就能看到。

# 验证步骤 (Verification steps)
1. 检查 `/workspace/deer-flow/CHANGELOG_v2.0.md` 是否生成且内容准确。
2. 检查 `/workspace/DeepResValue_WebApp_Release_v2.0.tar.gz` 是否成功创建。
3. 使用 `tar -tzf /workspace/DeepResValue_WebApp_Release_v2.0.tar.gz | head` 检查压缩包内容，确认排除了不需要的文件夹。