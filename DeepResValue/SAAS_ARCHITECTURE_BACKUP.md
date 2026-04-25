# DeepResValue SaaS 架构与源码白皮书 (2026-04)

> 💡 **文档说明**：本文档是对 DeepResValue 智能体项目从“单机本地版”重构为“SaaS 多租户版”后的全面总结。可作为团队新成员的架构培训手册，或后续正式部署云服务器时的架构备忘录。

---

## 1. 🚀 项目整体 SaaS 架构 (Architecture)

当前 DeepResValue 已经具备了一个标准的现代化 SaaS 平台雏形，采用了**前后端分离 + 智能体编排 + 多租户物理隔离**的云原生架构：

*   **前端层 (Frontend)**：基于 React (Vite/Next.js) 构建的 Web UI。通过 HTTP 接口与后端交互，通过 Server-Sent Events (SSE) 接收智能体的实时流式输出。
*   **网关与业务层 (Backend Gateway)**：基于 FastAPI 构建，是整个 SaaS 的入口。负责处理 JWT 身份认证、计费限流中间件（Rate Limiting & Points Billing）、以及文件上传的租户归属校验。
*   **智能体编排层 (LangGraph Engine)**：基于 LangGraph 框架构建的 Workflow，负责理解用户意图、规划步骤（Planning）、以及调用底层数据分析工具。状态（State）和历史记录（Checkpoints）已支持写入数据库，实现无状态扩展。
*   **安全沙盒隔离层 (Sandbox)**：
    *   *目前态*：使用本地 Docker 引擎 (`AioSandboxProvider`)，但已在挂载路径上实现了严格的 `{tenant_id}` 租户级物理隔离。
    *   *未来态*：架构上完全解耦了 Provider 接口，随时可无缝切换至 **E2B**、**阿里云函数计算(FC)** 或 **火山引擎弹性容器(VCI)**，实现 Serverless 级别的极速安全代码执行。
*   **持久化存储层 (Storage)**：引入了 `SQLAlchemy` ORM，默认使用 SQLite 测试，生产环境只需更改 `.env` 中的 `DATABASE_URL` 即可无缝切换为 PostgreSQL（如海外的 Neon 免费库）。

---

## 2. 💎 SaaS 产品已有功能 (Current Capabilities)

经过前几轮的重构与升级，当前版本已具备以下 SaaS 核心能力：

### 2.1 商业化基础设施 (Infrastructure)
*   **用户认证体系**：完整的 JWT 注册、登录、信息获取流程（密码采用 `bcrypt` 加密）。
*   **积分计费系统 (Point-based Billing)**：
    *   实现了全局大模型请求中间件，调用前拦截余额不足的请求（返回 `402 Payment Required`）。
    *   调用后异步解析 `usage` Token 消耗，按比例扣减积分，并生成不可篡改的账单流水 (`PointsLedger`)。
*   **多租户数据绝对隔离**：废弃了早期单点全局文件（如全局 `memory.json` 和 `USER.md`），将其全部转移至数据库 `TenantConfig` 模型。沙盒和上传文件路径彻底根据 `user_id` 划分。
*   **单用户并发防滥用**：在网关层加入了基于内存信号量的单用户并发限流（Rate Limiting），防止恶意脚本耗尽服务器资源。

### 2.2 高级智能数据分析能力 (AI & Analytics)
智能体已经深度集成了两大扩展分析库：
*   **StatsPAI (因果推断引擎)**：原生的计量经济学和因果推断核心库。
*   **StatsExt (高级多元分析与机器学习扩展)**：
    *   *多元分析*：PCA（主成分分析）、K-Means（聚类）、Factor Analysis（因子分析）。
    *   *关联分析*：CCA（典型相关分析）、PLS（偏最小二乘回归）。
    *   *机器学习预测*：Random Forest（随机森林回归/分类）、GBM（梯度提升树）。
    *   *文本挖掘 (NLP)*：TF-IDF 特征提取、LDA 主题模型。
    *   *Agent 路由回退*：配套编写了精密的 Prompt Engineering (`SKILL.md`)，智能体在上述高级库缺失或报错时，会自动回退（Fallback）至调用底层的 `scikit-learn` 完成任务。

---

## 3. 📂 源代码结构解析 (Source Code Overview)

项目的核心目录及其职责如下：

```text
/workspace/DeepResValue
├── backend/                  # 🟢 SaaS 核心后端与网关
│   ├── app/                  # FastAPI 业务网关 (鉴权, 计费, 路由)
│   │   ├── gateway/routers/  # 各种 REST API 路由 (auth.py, points.py, threads.py)
│   │   ├── models.py         # 数据库 ORM 模型 (User, PointsLedger, TenantConfig)
│   │   ├── database.py       # SQLAlchemy 数据库连接管理
│   │   └── auth_utils.py     # JWT 与密码加密逻辑
│   └── packages/harness/     # LangGraph 智能体核心框架
│       └── deerflow/
│           ├── agents/       # 智能体定义与中间件 (含计费前置/后置拦截器)
│           ├── sandbox/      # 沙盒适配器 (包含本地 AioSandbox 与 E2B 接口)
│           └── config/       # 系统配置 (包含多租户沙盒挂载路径 config.paths)
│
├── frontend/                 # 🟡 SaaS 网页前端 UI
│   ├── src/pages/            # 页面组件 (Chat, Home 等)
│   └── package.json          # React/Vite 前端依赖
│
├── StatsPAI/                 # 🟣 核心数据分析引擎 (原版)
├── StatsExt/                 # 🟣 高级扩展分析引擎 (我们在项目中抽离出的独立包)
│   └── src/statsext/         # 包含 correlation (CCA/PLS), ml (RF/GBM), nlp (LDA)
│
├── skills/                   # 🔵 Agent 技能提示词库 (SKILL.md)
│   └── custom/               # 存放我们编写的 DeepResValue-ML, DeepResValue-NLP 等路由指引
│
├── config.yaml               # ⚙️ 整个智能体系统的全局配置 (大模型选用, 沙盒引擎指定)
└── docs/                     # 📝 架构设计、演进计划和开发 Spec 留档
```

---

## 4. 🧩 当前缺失的组件 (Missing Components)

虽然 SaaS 的底层逻辑已经闭环，但距离面向 C 端用户的正式商用，还缺少以下拼图：

1.  **支付网关集成 (Payment Gateway)**：目前的 `/api/points/top-up` 充值接口仅更新了数据库余额。你需要去注册微信支付、支付宝或 Stripe 的商户号，接入支付回调 (Webhook) 逻辑。
2.  **前端控制台 UI 完善 (Dashboard UI)**：前端页面目前以 Chat 为主，还需要补充“用户登录页”、“积分账单明细流水页 (Billing)”和“扫码充值页”。
3.  **对象存储挂载 (Object Storage)**：目前用户的上传文件和产出物是暂存在云服务器 (ECS) 的本地磁盘里的。在用户量爆发前，需要将后端代码中的文件读写逻辑对接为真实的对象存储（如 阿里云 OSS 或 火山引擎 TOS）。

---

## 5. 🎯 下阶段完善方向 (Next Steps)

根据近期的规划探讨，我们明确了以下行动路线：

*   **☁️ 生产环境云端部署**
    *   购买一台 **阿里云 ECS**（挂载数据盘）作为主服务器。
    *   在早期 MVP 阶段，采用“零成本高安全”数据库策略：通过 [Neon.tech](https://neon.tech/) 或 [Supabase](https://supabase.com/) 注册海外 Serverless PostgreSQL，将账号和资金明细存入云端数据库，以保障核心资产绝对安全。
*   **🔥 沙盒引擎的云原生升级 (重点)**
    *   随着用户增多，本地 ECS 跑 Docker 会遇到计算资源瓶颈。
    *   我们计划废弃本地 Docker，将沙盒执行引擎切换至 **火山引擎 (Volcengine)**。
    *   考察并接入火山引擎的 **veFaaS (函数计算)** 或 **VCI (弹性容器实例)**，为每个用户的 Python 代码分析任务提供毫秒级启动、用完即毁、按需计费的极致安全执行环境。
*   **🌐 SaaS 产品化上线**
    *   申请国内备案域名，配置 HTTPS。
    *   完成上述所有联调后，将产品正式开放给大学生与科研群体使用。