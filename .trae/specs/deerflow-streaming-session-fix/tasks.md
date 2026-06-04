
# DeerFlow 流式与会话切换优化 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 修改 fetchStateHistory 配置
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 hooks.ts 中的 useStream 配置，将 `fetchStateHistory: { limit: 1 }` 改为 `fetchStateHistory: true`
  - 参考官方实现：
    - [agent-chat-ui/src/providers/Stream.tsx#L96](file:///workspace/agent-chat-ui/src/providers/Stream.tsx#L96)
    - [deep-agents-ui/src/app/hooks/useChat.ts#L48](file:///workspace/deep-agents-ui/src/app/hooks/useChat.ts#L48)
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgement` TR-1.1: 切换会话后验证能看到完整历史消息，不需要刷新
  - `programmatic` TR-1.2: 验证代码中 fetchStateHistory 已正确配置为 true
- **Notes**: 这是最关键的修改，风险最低，应该首先实施

## [x] Task 2: 优化 threadId 变化时的状态清理逻辑
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 在 hooks.ts 的 threadId 变化 useEffect 中，添加完整的状态清理逻辑
  - 清理内容包括：重置 startedRef、sendInFlightRef、optimisticMessages、pendingUsageBaselineMessageIdsRef、messagesRef、summarizedRef
  - 确保切换会话时没有状态残留
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-2.1: 在会话 A 有进行中请求时切换到会话 B，验证会话 B 没有会话 A 的残留内容
  - `programmatic` TR-2.2: 验证代码中 threadId 变化时的清理逻辑完整
- **Notes**: 这是确保状态隔离的重要修改

## [x] Task 3: 验证和观察流式渲染效果
- **Priority**: P1
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 实施前两个修改后，验证流式渲染效果
  - 观察消息是否还会突然整段出现
  - 如果问题仍然存在，进一步分析是前端还是后端的问题
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgement` TR-3.1: 发送产生长回复的消息，验证流式渲染是否平滑
- **Notes**: 此步骤主要是验证前两步的效果，根据结果决定是否需要进一步修改

