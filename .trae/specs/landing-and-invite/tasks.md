# Tasks

- [x] Task 1: 更新数据库模型与 Auth 接口 (Backend)
  - [x] SubTask 1.1: 在 `backend/app/auth/models.py` 中为 `User` 模型新增 `my_invite_code` (String, unique) 和 `invited_by` (String) 字段。
  - [x] SubTask 1.2: 编写 Alembic migration 脚本或更新 `Base.metadata.create_all` 逻辑以应用数据库结构变更。管理员需预先通过 SQL 插入至少一个内测码（如 `DEEP2026`，`id=0` 或 `is_admin=True` 的专属码）。
  - [x] SubTask 1.3: 更新 `backend/app/auth/schemas.py`，在 `UserCreate` 模型中增加 `invite_code` 必填项，在 `User` 返回模型中增加 `my_invite_code` 字段。
  - [x] SubTask 1.4: 修改 `backend/app/auth/router.py` 的 `/auth/register` 接口。
        - 验证传入的 `invite_code` 是否在数据库（查找 `User.my_invite_code` 或硬编码的内测码集合）存在。
        - 为新用户生成 8 位随机的 `my_invite_code`。
        - 给新用户增加 50 积分（即初始 100+50 = 150）。
        - 给邀请人（对应的 `User`）的 `credits` 增加 100 积分。

- [x] Task 2: 制作动态算法艺术背景 (Frontend / p5.js)
  - [x] SubTask 2.1: 在 `frontend/src/components/` 目录下创建一个 `GenerativeBackground.tsx` 组件。
  - [x] SubTask 2.2: 根据 `algorithmic-art` 技能指导，使用 `p5.js`（或 CSS/SVG 粒子）编写一段具有“涌现行为、数学美感、科技流动感”的动态算法艺术效果。颜色采用 `brand-guidelines` 的暗色 `#141413` 底色，以及强调色 `#d97757` (橙色) 或 `#6a9bcc` (蓝色) 作为粒子/线条色彩。

- [x] Task 3: 制作品牌化落地页 (Frontend Landing Page)
  - [x] SubTask 3.1: 在 `frontend/src/pages/` 目录下创建 `Landing.tsx`。
  - [x] SubTask 3.2: 引入 `GenerativeBackground.tsx` 作为全屏背景（`z-index: -1`）。
  - [x] SubTask 3.3: 编写居中对齐的文案，字体采用 `Poppins` (标题) 和 `Lora` (正文) 风格。文案内容强调“DeepResValue - 智能数据分析与 Agent 编排引擎”、“闭门内测中，凭邀请码加入”。
  - [x] SubTask 3.4: 添加“登录 / 立即注册”的按钮组，引导用户跳转至 `/login`。

- [x] Task 4: 更新前端注册与路由逻辑 (Frontend Integration)
  - [x] SubTask 4.1: 修改 `frontend/src/App.tsx` 的路由配置。将根路径 `/` 映射为 `Landing.tsx`，将原来的应用主体界面映射为 `/chat` 或受保护路由（目前已由 `Layout` 保护）。未登录用户访问 `/chat` 自动跳回 `/login` 或 `/`。
  - [x] SubTask 4.2: 修改 `frontend/src/pages/Login.tsx` 中的注册表单部分，增加一个输入框“邀请码 (Invite Code)”，并在注册请求中传递给后端。
  - [x] SubTask 4.3: 在用户登录后的某个合适位置（如个人中心弹窗、或左侧边栏底部的“复制邀请码”按钮），展示用户的 `useAuthStore.getState().user.my_invite_code`，并提供一键复制功能。

# Task Dependencies
- [Task 1] MUST be completed before [Task 4.2]
- [Task 2] MUST be completed before [Task 3]
- [Task 3] MUST be completed before [Task 4.1]