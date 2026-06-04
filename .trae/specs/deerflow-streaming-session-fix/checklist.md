
# DeerFlow 流式与会话切换优化 - Verification Checklist

## Code Verification Checkpoints
- [ ] `fetchStateHistory` 已从 `{ limit: 1 }` 修改为 `true`
- [ ] threadId 变化时的 useEffect 中有完整的状态清理逻辑
- [ ] 所有状态引用都被正确重置（startedRef, sendInFlightRef, optimisticMessages 等）
- [ ] 没有引入新的依赖或破坏现有代码结构

## Functionality Verification Checkpoints
- [ ] 切换会话时能看到完整的历史消息，不需要刷新页面
- [ ] 从会话 A 切换到会话 B 再切换回会话 A，会话 A 的内容正确显示
- [ ] 在会话 A 有进行中请求时切换到会话 B，会话 B 没有显示会话 A 的残留内容
- [ ] 发送长回复时，流式渲染是平滑的，不会突然整段出现
- [ ] 消息复制、文件展示等现有功能正常工作

## Reference Project Alignment Checkpoints
- [ ] useStream 配置与 agent-chat-ui 中的官方实现保持一致
- [ ] 状态管理逻辑与 deep-agents-ui 中的最佳实践保持一致

