# StatsPAI 源码与架构学习计划

## 1. 目标概述 (Summary)
本次任务的目标是深入学习并分析 **StatsPAI** 开源项目。StatsPAI 是一个专为大语言模型（LLM）智能体设计的因果推断和应用计量经济学 Python 工具包。分析将涵盖项目的核心架构、工作流、智能体集成机制（Agent-Native）、核心实证分析函数的调用方式及其参数规范，以及 Claude Code Skills 系统的运作原理。最终将为您生成一份详尽的《StatsPAI 架构与工作方式解析报告》。

## 2. 当前状态分析 (Current State Analysis)
- 项目已成功克隆至 `/workspace/StatsPAI`。
- **主要目录结构**：
  - `src/statspai/`：核心源码目录，包含 70+ 个领域模块（如 `did`, `iv`, `rd`, `synth`, `dml` 等），以及智能体相关的集成模块（`agent/`, `registry.py`）。
  - `src/statspai/core/`：包含统一的结果对象（如 `CausalResult`, `EconometricResults`）。
  - `StatsPAI_skill/`：包含供 Claude Code 使用的技能定义文件（`SKILL.md`, `README.md`）。
  - `docs/` 和 `tests/`：包含大量指南和测试用例。
- **项目特点**：采用 Agent-Native 设计，所有函数都可以通过 Schema 描述自身（`describe_function()`），并返回结构化的结果以便 LLM 解析。

## 3. 详细分析步骤 (Proposed Steps for Analysis)

为全面掌握该项目，我将按照以下步骤逐步剖析源码，并最终汇总为报告：

### 第一步：核心架构与工作流分析 (Core Architecture & Workflow)
- **分析内容**：
  - 解析 `src/statspai` 下的模块组织方式（按因果推断方法分类）。
  - 分析 `CausalResult` 和 `EconometricResults` 基类，理解结果对象如何统一输出（`.summary()`, `.to_latex()`, `.to_agent_summary()`）。
  - 梳理官方推荐的**标准六步实证分析工作流**：数据契约 (Data Contract) -> EDA -> 研究问题定义 (`causal_question`) -> DAG 发现 -> 估计估算 -> 诊断与稳健性检验。

### 第二步：智能体集成机制深度解析 (Agent Integration Mechanism)
- **分析内容**：
  - 探究 `src/statspai/agent/` 目录，特别是 `mcp_server.py`, `tools.py` 和 `remediation.py`。
  - 了解 `tool_manifest()` 如何将 Python 函数转换为 OpenAI/Anthropic 格式的 Tool Schema。
  - 解析 `src/statspai/registry.py`，了解函数是如何被注册（`@register_estimator`）并生成 Agent 卡片（`sp.agent_card`）的。
  - 了解异常处理机制（如 `StatsPAIError`, `AssumptionViolation`）如何为智能体提供修复建议（Recovery hints）。

### 第三步：核心实证分析函数与参数规范 (Empirical Functions & Parameters)
- **分析内容**：
  - 选取具有代表性的核心函数（如 `sp.callaway_santanna` (DID), `sp.rdrobust` (RD), `sp.synth` (SCM)）。
  - 分析它们的入参结构（如何传入 `data`, `y`, `treatment`, `time`, `id` 等）。
  - 分析调度器（Dispatcher）模式（如 `sp.causal_question().identify().estimate()`）是如何在底层路由到具体算法的。

### 第四步：Skills 系统剖析 (Skills System)
- **分析内容**：
  - 阅读并解析 `StatsPAI_skill/SKILL.md` 的内容结构。
  - 分析 Prompt 设计：触发词（triggers）、Agent 操作手册（Step 0-6 Workflow）以及方法目录（Method Catalog）。
  - 了解 Skill 是如何指导智能体在实际对话中一步步引导用户完成因果推断分析的。

### 第五步：输出总结报告 (Generate Final Report)
- **分析内容**：将上述四步的研究成果整理成一篇结构清晰、通俗易懂的《StatsPAI 架构与工作方式解析报告》，直接在对话中交付给您。

## 4. 假设与决策 (Assumptions & Decisions)
- **假设**：您需要的是一份概念化且结合源码实现原理的深度报告，而非仅仅是使用说明书。
- **决策**：报告将重点突出“Agent-Native”这一核心特性，解释 StatsPAI 与传统统计库（如 statsmodels）在架构设计上的最大区别。

## 5. 验证步骤 (Verification Steps)
- 在每一步分析时，我将通过 `Read` 或 `Grep` 工具直接查阅 `src/statspai` 中的关键代码片段以确保报告的准确性。
- 最终报告将覆盖您提到的所有关键点：架构、工作方式、智能体集成、函数参数说明、Skills系统。
