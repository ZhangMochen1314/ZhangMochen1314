# 修复服务端配置任务 (Fix Server Config Tasks)

## 摘要 (Summary)
根据 `/workspace/Trae_Solo_Fix_Tasks_V3.md` 中 Coze 发现的问题，我们需要修复以下四点：
1. **Agent目录不存在（核心问题）**：创建缺失的 Agent 目录及默认 `SOUL.md` 配置。
2. **config.yaml 未配置百炼模型**：在全局配置中增加阿里云百炼的 `deepseek-v4-pro-bailian` 及 `deepseek-v4-flash-bailian`。
3. **默认模型设置**：将 `config.yaml` 的默认模型指向 `deepseek-v4-pro-bailian`。
4. **Redis认证警告**：在 `.env` 和 `.env.example` 中补充带鉴权信息的 `REDIS_URL`。

## 现状分析 (Current State Analysis)
- `backend/.deer-flow/agents/agent` 目录缺失，导致系统运行时报 "Agent directory not found"。
- `/workspace/config.yaml` 仅有之前配置的 `deepseek-v4-pro-search` 和官方模型，缺少明确定义的 `deepseek-v4-pro-bailian`（及其 flash 版本）。
- 并且 `config.yaml` 中缺少全局的 `default_model` 字段定义。
- `.env` 文件中的 Redis 配置为空或缺失 `REDIS_URL`，导致服务尝试无密码连接阿里云 Redis 实例时报错 `Authentication required`。

## 建议变更 (Proposed Changes)

### 1. 修复 Agent 目录缺失
**操作**: 
- 创建 `/workspace/backend/.deer-flow/agents/agent` 目录。
- 在该目录下写入默认的 `SOUL.md`，设定 AI 助手的基本能力（回答问题、分析数据、编写代码）。

### 2. 更新 `config.yaml` 配置模型及默认值
**文件**: `/workspace/config.yaml`
**操作**:
- 在顶层添加 `default_model: deepseek-v4-pro-bailian`。
- 修改 `models` 列表，将以下模型插入最前方：
  - `deepseek-v4-pro-bailian`（开启百炼 + 联网搜索能力）。
  - `deepseek-v4-flash-bailian`（轻量级百炼模型，快速响应）。
  - 顺便更新备用官方模型的显示名称。

### 3. 修复 Redis 鉴权配置
**文件**: `/workspace/.env` 和 `/workspace/.env.example`
**操作**:
- 添加 `REDIS_URL=redis://:DeepResValue@2026@r-bp1tlzw152y94uncz5.redis.rds.aliyuncs.com:6379/0`。
- 注释掉原本无效的 `REDIS_HOST` 和 `REDIS_PORT`（如有），防止冲突。

## 假设与决策 (Assumptions & Decisions)
- 由于之前我们已经将代码平铺到根目录，所以 Coze 提到的路径 `/var/www/deepresvalue/deer-flow/backend/.deer-flow` 对应我们在 Git 中的相对路径就是 `backend/.deer-flow/`。
- 修改将直接提交并推送到 GitHub 仓库，以便用户在服务器上直接通过 `git pull` 一键获取全部配置修复，而不需要手动 SSH 修改每一个文件。

## 验证步骤 (Verification Steps)
- 确认 `/workspace/backend/.deer-flow/agents/agent/SOUL.md` 存在。
- 确认 `/workspace/config.yaml` 包含 `default_model` 且 `models` 语法格式正确。
- 确认 `.env` 中已配置 `REDIS_URL`。