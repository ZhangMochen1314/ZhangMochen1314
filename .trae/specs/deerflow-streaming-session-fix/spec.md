
# DeerFlow 流式与会话切换优化 - Product Requirement Document

## Overview
- **Summary**: 优化 DeerFlow 的流式渲染和会话切换体验，解决会话切换时内容中断和流式渲染突然出现的问题。
- **Purpose**: 提升用户体验，实现流畅的多会话并发使用体验，确保切换会话时状态正确恢复，流式内容能够平滑展示。
- **Target Users**: DeerFlow 的所有用户，特别是使用多会话功能的用户。

## Goals
- 会话切换时，能够正确显示之前会话的完整历史消息
- 会话切换时，状态能够正确重置，避免跨会话污染
- 流式内容能够平滑渲染，而非突然整段出现
- 保持 DeerFlow 现有的架构与功能完整性

## Non-Goals (Out of Scope)
- 不改变后端的多任务策略（`multitask_strategy`）
- 不改变现有的认证和用户隔离机制
- 不重构整个消息渲染系统
- 不添加额外的外部依赖库

## Background & Context
DeerFlow 是一个基于 LangGraph 的 AI 助手应用，具有完整的多用户隔离和后台任务管理架构。当前存在两个主要问题：
1. 会话切换时，内容出现中断，需要刷新页面才能看到新输出
2. 流式渲染时，内容经常突然整段出现，而非平滑的打字机效果

**关键参考项目（官方实现）**：
- **agent-chat-ui**：LangChain 官方提供的聊天界面，展示了正确的 useStream 使用方式
- **deep-agents-ui**：更复杂的代理交互界面，展示了完整的流控制

**关键参考文件**：
- [agent-chat-ui/src/providers/Stream.tsx](file:///workspace/agent-chat-ui/src/providers/Stream.tsx)：展示正确的 useStream 配置
- [deep-agents-ui/src/app/hooks/useChat.ts](file:///workspace/deep-agents-ui/src/app/hooks/useChat.ts)：展示完整的流管理和会话切换处理

## Functional Requirements
- **FR-1**: 切换会话时，正确获取并显示完整历史消息
- **FR-2**: 切换会话时，清理旧会话的状态，避免跨会话污染
- **FR-3**: 流式内容能够平滑渲染，不出现突然整段显示的情况

## Non-Functional Requirements
- **NFR-1**: 会话切换响应时间 &lt; 500ms
- **NFR-2**: 保持现有代码的可维护性，最小化改动
- **NFR-3**: 不影响现有功能的正常使用

## Constraints
- **Technical**: 必须使用现有的 LangGraph SDK，不能引入新的大型依赖
- **Business**: 改动范围必须最小化，不能影响现有功能的稳定性
- **Dependencies**: 依赖 DeerFlow 已有的后端架构，不改变后端 API

## Assumptions
- DeerFlow 的后端流式输出机制是正确的
- LangGraph SDK 的 useStream Hook 功能正常
- 用户已有的会话数据是完整存储的

## Acceptance Criteria

### AC-1: 会话切换时历史消息正确显示
- **Given**: 用户有两个会话，会话 A 和会话 B，都有历史消息
- **When**: 用户从会话 A 切换到会话 B，再从会话 B 切换回会话 A
- **Then**: 会话 A 的完整历史消息都能正确显示，不需要刷新页面
- **Verification**: `human-judgment`
- **Notes**: 验证每个会话的历史完整性

### AC-2: 会话切换时状态正确清理
- **Given**: 用户在会话 A 中有正在进行的流式请求
- **When**: 用户切换到会话 B
- **Then**: 会话 B 的状态是干净的，不会显示会话 A 的残留内容
- **Verification**: `human-judgment`
- **Notes**: 验证状态隔离

### AC-3: 流式内容平滑渲染
- **Given**: 用户在会话中发送一个会产生长回复的消息
- **When**: AI 生成回复并流式输出
- **Then**: 回复内容能够平滑显示，呈现打字机效果，不会突然整段出现
- **Verification**: `human-judgment`
- **Notes**: 验证流式体验的流畅度

## Open Questions
- [ ] DeerFlow 的后端是否完整支持 `fetchStateHistory: true` 配置？
- [ ] 当前的 `mergeMessages` 逻辑在哪些具体场景中会导致问题？
- [ ] 是否有用户反馈的具体复现步骤可以进一步定位问题？

