# Tasks
- [x] Task 1: 前端登录与注册页面重构 (Frontend UI):
  - [x] SubTask 1.1: 在 `frontend/src/pages/Login.tsx` 和 `Register.tsx` 中使用 Tailwind CSS 和类似于 shadcn/ui 的现代化设计风格（如 Card, Form 布局），优化原有的基础表单，加入更友好的交互反馈和错误提示。
- [x] Task 2: 后端支付宝支付网关集成 (Backend Alipay Integration):
  - [x] SubTask 2.1: 在 `backend/pyproject.toml` 或环境中安装 `python-alipay-sdk` 依赖。
  - [x] SubTask 2.2: 在 `backend/app/billing/alipay_client.py` 中编写 `AliPay` 的初始化与环境变量读取逻辑（公钥、私钥等）。
  - [x] SubTask 2.3: 在 `backend/app/billing/router.py` 中新增 `POST /checkout/alipay` 接口用于生成支付宝 PC 网站支付的重定向链接（Page Pay）。
  - [x] SubTask 2.4: 在 `backend/app/billing/router.py` 中新增 `POST /webhook/alipay` 接口，接收支付宝异步通知，验证签名，并在交易成功时更新数据库的 `Transaction`、`Order` 状态，同时为用户增加对应的 `credits`（积分）。
- [x] Task 3: 前端文件传输与历史对话集成 (Frontend Features):
  - [x] SubTask 3.1: 在 `frontend/src/pages/Chat.tsx` 中集成侧边栏，调用后端的 `GET /api/threads` 接口，拉取并按时间排序展示当前用户的历史会话记录（History）。
  - [x] SubTask 3.2: 在 `frontend/src/pages/Chat.tsx` 的输入框旁新增一个“上传附件”的交互按钮，支持调用 `POST /api/threads/{thread_id}/uploads` 接口，将用户选择的文件发送到后端供分析使用。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2