# 阿里云大模型联网搜索及核心服务集成计划

## 摘要 (Summary)
根据 `/workspace/Trae_Solo_Next_Steps_V2.md` 的指引，我们将全面接入阿里云的大语言模型与生态服务。
通过集成阿里云百炼的 `deepseek-v4-pro`，我们将为大模型原生赋能**联网搜索**能力（对于文献搜集、统计建模等技能尤为关键）。同时，我们将完善 `llm_service.py` 的主备切换逻辑，并将相关的鉴权环境变量注入到系统配置中。
（注：OSS 预签名 URL 接口以及阿里云 FC 函数计算迁移，在此前的 SaaS 架构集成步骤中已由 Trae Solo 提前完成）。

## 现状分析 (Current State Analysis)
- **大模型调用**：目前 `config.yaml` 中仅配置了基于 DeepSeek 官方 API 的 `deepseek-v4-pro` 模型，缺乏内置联网能力，且无主备自动切换机制。
- **环境变量**：之前仅配置了数据库的环境变量，缺少 OSS、阿里云百炼、FC 等密钥的统一管理和系统级注入。
- **已完成事项**：OSS 的 `generate_presigned_url` 接口（位于 `app/gateway/routers/files.py`）以及 FC 执行器沙盒（位于 `fc_sandbox.py`）已经实现完毕并验证通过。

## 建议变更 (Proposed Changes)

### 1. 配置系统级环境变量
**文件**: `.env.example`, `deepresvalue.service`
**操作**: 
- 将 `DASHSCOPE_API_KEY`, `DEEPSEEK_API_KEY` 以及 `ALIYUN_OSS_*`, `ALIYUN_FC_*` 等环境变量统一写入 `.env.example`，作为规范。
- 更新 `deepresvalue.service` 模板，在 `[Service]` 区块内通过 `Environment` 指令将这些必要的系统级密钥挂载进去。

### 2. 实现 LLMService 主备切换逻辑
**文件**: `backend/app/services/llm_service.py` (新增)
**操作**:
- 按照 V2 指南编写 Python 服务类 `LLMService`。
- 初始化 `primary_client` (阿里云百炼，支持联网搜索) 和 `backup_client` (DeepSeek 官方)。
- 实现 `chat` 异步方法，包含 `enable_search` (仅主模型支持) 的注入，以及当主模型调用失败时自动 fallback 到备用模型的容灾机制。
- 供后续 Python 形式的技能（如数据分析脚本）直接调用。

### 3. 配置主智能体的联网搜索模型
**文件**: `config.yaml`
**操作**:
- 在全局的 `models:` 列表中新增一个名为 `deepseek-v4-pro-search` 的配置项。
- 绑定 `DASHSCOPE_API_KEY` 和阿里云百炼的 `base_url`。
- 在 `extra_body` 中硬编码注入 `enable_search: true`。
- 这样前端界面的模型下拉框中就会出现带联网能力的模型，当用户在对话区要求“文献搜集”或触发 Prompt-based 技能时，主智能体就能直接调用底层的联网能力。

## 假设与决策 (Assumptions & Decisions)
- **决策**：对于 Prompt-based 的纯文本技能（如 `DeepResValue-Literature-Search` 的 `SKILL.md`），它们由主智能体（Agent）驱动。因此，我们在 `config.yaml` 中提供带 Search 能力的模型是满足它们联网需求的最优解。而 `llm_service.py` 则为硬编码的 Python 后端任务提供程序化的高可用保障。
- **假设**：OSS 与 FC 的业务已经在之前的模块完全实现，所以本次计划中我们只需声明其已完成，无需再编写重复代码。

## 验证步骤 (Verification Steps)
- 检查 `config.yaml` 语法是否合法，确保 `deepseek-v4-pro-search` 可被解析。
- 本地导入 `backend.app.services.llm_service` 并尝试实例化 `LLMService` 确保无语法报错。
- 检查 `.env.example` 和 `deepresvalue.service` 模板是否包含所有要求的新变量。