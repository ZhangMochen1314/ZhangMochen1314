# 智能体数据分析与 StatsPAI 集成设计方案

## 1. 目标概述 (Summary)
设计一套机制，使基于 LangGraph 构建的智能体（Lead Agent）能够准确理解大学生的科研数据分析需求，精准调用预装在 Sandbox 镜像中的 `statspai` 库完成计量经济学和因果推断分析，并在 `statspai` 不适用或报错时，平滑地降级到备用机制（原生 Python/pandas/statsmodels），确保分析任务始终能够完成。

## 2. 当前状态分析 (Current State Analysis)
- **智能体架构**：项目基于 `deerflow` harness，核心是一个 `lead_agent`，其系统提示词（`prompt.py`）中动态注入了启用的 Skills 列表。智能体通过生成 Python 代码并在隔离的 Sandbox 中执行（借助 `bash` tool）来完成任务。
- **Skills 系统**：`skills/custom/` 目录下定义了多个专门的技能（如 `DeepResValue-DID`, `DeepResValue-DataClean`）。当用户输入触发技能描述时，智能体会读取相应的 `SKILL.md`，获取具体的执行策略和代码示例。
- **StatsPAI 集成**：已经在规划将 StatsPAI 作为 Core 依赖预装在 Sandbox 镜像中，但目前智能体如何被引导去*准确*使用它，以及何时该*放弃*使用它，主要依赖于 `SKILL.md` 中的提示词约束。

## 3. 拟议设计：数据分析意图识别与 Skill 路由 (Proposed Changes)

为了让智能体准确使用 StatsPAI，首先需要它能正确识别出“这属于什么类型的分析”，然后加载正确的规则。

### 3.1 强化意图澄清 (Intent Clarification)
大学生用户的需求往往是模糊的（如“帮我分析一下这组数据”）。智能体不能盲目猜测，必须引入**“踩刹车”机制**。

**设计动作**：
修改或新增一个全局的数据分析“入口” Skill（例如 `DeepResValue-DataAnalysis-Router`），或者在 `lead_agent` 的系统提示词中增加**数据预检与需求探针**规则：
1. **数据探针**：收到数据文件后，智能体必须先写一段简单的 Python 代码在 Sandbox 中读取数据头部（`df.head()`）、描述性统计（`df.describe()`）和数据类型（`df.info()`），了解数据长什么样。
2. **需求逼问**：基于数据探针的结果，智能体必须向用户提问，直到明确以下关键要素：
   - 研究问题是什么？（要证明什么因果关系？）
   - 被解释变量（y）、核心解释变量/政策变量（x/treatment）是什么？
   - 数据结构是横截面、时间序列还是面板数据（Panel Data）？
3. **Skill 路由**：明确需求后，智能体根据研究设计匹配到具体的 Skill（如，确认是政策评估，面板数据，则路由到 `DeepResValue-DID`）。

### 3.2 规范化具体 Skill 的内容结构
以 `DeepResValue-DID` 为例，现有的 `SKILL.md` 结构很好，但需要进一步强化“如何使用 StatsPAI”的指导。

**设计动作**：
标准化所有涉及数据分析的 `SKILL.md`，必须包含以下部分：
- **触发条件**：什么时候应该应用这个 Skill。
- **数据要求**：模型对数据的隐性要求（如 DID 需要面板数据和明确的处理时间）。
- **StatsPAI 优先策略 (StatsPAI First Strategy)**：
  - 明确指定应该导入 StatsPAI 的哪个模块（如 `from statspai.did.callaway_santanna import callaway_santanna`）。
  - 提供该模块的**标准调用示例代码**，包括必填参数说明（如 `data`, `y`, `g`, `t`, `id_col`）。智能体往往不知道库的 API 长什么样，提供示例代码能大幅提高调用准确率。
  - 明确指出 StatsPAI 结果对象（如 `CausalResult`）自带的便捷方法（如 `.summary()`, `.plot()`），指导智能体如何输出学术规范的表格和图表。

## 4. 拟议设计：StatsPAI 精准调用与容错/备用机制 (Fallback Mechanism)

即使有提示词指导，智能体生成的 StatsPAI 代码仍可能因为数据不合规、API 版本差异或特殊边角情况而执行失败。必须设计平滑的降级机制。

### 4.1 StatsPAI 自带的异常诊断与修复 (Self-Repair)
StatsPAI 本身设计了面向智能体的异常分类（如 `AssumptionViolation`），会抛出带有 `recovery_hint`（修复提示）的错误。

**设计动作**：
在所有的分析 `SKILL.md` 中，增加**错误处理指导**：
- "当执行 `statspai` 代码报错时，请**仔细阅读错误信息中的 `recovery_hint`**。如果提示缺少变量、数据类型不匹配或违反了统计假设，请根据提示编写数据清洗或转换代码，修复数据后**重新尝试调用 `statspai`**。"

### 4.2 明确的边界与降级策略 (Fallback to Native Python)
如果 StatsPAI 确实不支持用户的特定需求（例如，用户要求一种非常偏门的稳健性检验），或者重试多次依然失败，智能体不能卡死。

**设计动作**：
在 `SKILL.md` 中设定明确的“降级触发条件”和“备用代码模板”：
- **降级触发条件**：
  - `statspai` 明确报错提示“该模型/方法未实现 (NotImplemented)”。
  - 连续尝试修复并执行 `statspai` 代码 3 次均失败。
  - 用户提出的特定分析细节，在 `statspai` 的标准参数中找不到对应项。
- **备用机制 (Fallback)**：
  - "如果触发降级条件，**立即放弃使用 `statspai`**。"
  - "转而使用基础的 Python 数据科学生态：`pandas`, `numpy`, `statsmodels`, `linearmodels`, `scikit-learn` 来手动实现该分析。"
  - 提供基础实现的简要示例。例如，在 DID 的 Fallback 中提示：“使用 `linearmodels.PanelOLS` 构建双向固定效应模型”。

## 5. 假设与决策 (Assumptions & Decisions)
- **假设**：智能体（基于 Claude 等强大 LLM）具备遵循长篇系统提示词和 `SKILL.md` 中代码示例的能力，并能理解多轮对话的上下文。
- **决策**：将集成的重心放在**Prompt Engineering (提示词工程)** 上，即通过完善和规范化 `skills/custom/` 下的文档，来“教”智能体怎么用 StatsPAI，而不是去修改后端的 Python 路由代码。这符合本项目现有的 Agent 架构设计。

## 6. 验证步骤 (Verification Steps)
- 检查 `DeepResValue-DID` 等现有的 `SKILL.md`，确认是否已经包含了清晰的 API 示例、异常处理提示和明确的 Fallback 机制。
- 如果用户同意该计划，后续实施将重点优化和补充这些 Skill 文档。
