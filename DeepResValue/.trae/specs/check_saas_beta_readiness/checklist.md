# 验收清单 (Checklist)

## 1. 邀请机制闭环与管理员工具
- [x] 后端：可以通过运行 `python -m scripts.generate_beta_codes --count 10` 等命令，成功向数据库中批量写入新的初始内测码。
- [x] 前端控制台：用户能够在 `Dashboard.tsx` 页面清晰地看到自己的专属邀请码（如 `DEEP-XXXX`），点击复制按钮能够将该邀请码成功复制到剪贴板。

## 2. 新手引导与产品反馈收集
- [x] 后端模型与接口：成功新增 `UserFeedback` 模型，调用 `POST /api/feedback` 能够成功保存包含用户 ID 与正文内容的反馈记录。
- [x] 前端反馈交互：能够在页面顶部或侧边栏点击「反馈建议」，弹出反馈模态框；填写内容提交后，成功调用后端接口并给出友好的 Toast 提示。
- [x] Chat 空状态引导：当新建一个空对话进入 `Chat.tsx` 时，屏幕中央应展示醒目的欢迎引导语与 3-4 个快捷提示词（Prompt 模板），点击后即可填入底部的输入框中。

## 3. 核心接口限流保护 (Rate Limiting)
- [x] 限流组件集成：成功在 FastAPI 服务中集成并启动了 `slowapi`（或等效的限流器）。
- [x] API 防刷测试：在 1 分钟内连续高频调用 `POST /api/threads/{thread_id}/runs/stream` 超过限制阈值时，后端能够正确拦截请求并返回 `429 Too Many Requests`。
