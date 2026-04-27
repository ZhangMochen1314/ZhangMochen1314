# 前端模式与后端 Agent 映射架构实现计划

## 摘要 (Summary)
本项目旨在完善前端界面与后端大模型 System Prompt 之间的核心控制映射关系。具体包括：
1. **三大对话模式**（导师模式、学术模式、助手模式）的映射。
2. **联网搜索功能**的独立开关映射。
3. **技能列表挂载**（前端单选、后端不限数量）的注入。
4. **深度思考 (Deep Thinking)** 功能的前端 UI 按钮开发及后端引擎调度映射。

## 现状分析 (Current State Analysis)
1. **三大模式 & 联网 & 技能**：
   - **前端现状**：`Chat.tsx` 已经实现了这三者的 UI 交互，并在用户发送消息时，通过纯文本前缀（如 `[导师模式] [启用联网搜索] @文献检索`）拼接在用户输入的最前方。
   - **后端现状**：后端的 `lead_agent/prompt.py` 中**已经完美预留了这三者的映射拦截规则**。大模型会根据前缀动态调整自己的回答基调（例如看到 `[导师模式]` 就只启发不给答案），并自动调用相关技能流。
2. **深度思考功能**：
   - **前端现状**：缺少独立控制的 UI 按钮。目前 `Chat.tsx` 中的 `sendToDeerflow` 强行写死了 `thinking_enabled: true`。
   - **后端现状**：后端引擎（`factory.py` 与 `services.py`）已经完全支持接收 `configurable.thinking_enabled` 参数，并能自动处理底层 DeepSeek 模型（如百炼 Pro 或官方 Reasoner）的思考参数注入与 SSE 流式返回。

## 建议变更 (Proposed Changes)

### 1. 前端 UI 新增「深度思考」按钮
**文件**: `frontend/src/pages/Chat.tsx`
**操作**:
- 引入新的 React 状态 `const [isDeepThink, setIsDeepThink] = useState(false);`。
- 在底部输入框 `<textarea>` 左侧的按钮组（即“地球”图标旁边），新增一个大脑或闪电图标的切换按钮。
- 当按钮开启时，图标附带 `animate-pulse` 呼吸灯效果，并显示 Tooltip “深度思考已开启”。

### 2. 动态组装参数并映射给后端
**文件**: `frontend/src/pages/Chat.tsx`
**操作**:
- 修改 `sendToDeerflow` 函数，将强行写死的参数改为动态读取：
  ```javascript
  config: {
    recursion_limit: 100,
    configurable: {
      // 动态传递深度思考开关
      thinking_enabled: isDeepThink,
      // 默认使用我们在 config.yaml 中配置好的百炼模型
      model_name: "deepseek-v4-pro-bailian"
    }
  }
  ```
- 修改 `systemPrefix` 的组装逻辑，在文本层面追加 `[深度思考]` 标识，双重刺激模型进入 Reasoning 状态：
  ```javascript
  if (isDeepThink) {
    systemPrefix += `[深度思考] `;
  }
  ```

## 假设与决策 (Assumptions & Decisions)
- **决策**：关于**技能列表挂载**，前端目前的设计是右侧工具箱单选（或点击替换输入框），这是合理的，因为这符合普通用户的操作心智；而在 Agent 后端，它是没有数量限制的（通过 `@技能1 @技能2` 可以挂载多个）。因此，我们保持现有的技能组装前缀 `@SkillName` 不变，后端 `prompt.py` 会自动解析并挂载对应技能模块。
- **假设**：后端 `config.yaml` 已经成功配置了 `deepseek-v4-pro-bailian`（支持 thinking 和联网），所以我们前端可以直接将其作为主驱模型。

## 验证步骤 (Verification Steps)
- 运行前端页面，确认输入框左侧是否出现深度思考的按钮。
- 开启/关闭按钮，观察图标的颜色和动画反馈。
- 发送消息并在 Network 网络请求面板中检查 `/api/threads/{tid}/runs/stream` 的 Payload，确认 `thinking_enabled` 和前缀是否随开关正确变化。