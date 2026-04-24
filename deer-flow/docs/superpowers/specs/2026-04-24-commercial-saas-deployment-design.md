# DeepResValue 2.0 商业化内测部署设计 (ECS+RDS 架构)

**Status:** Draft / Approved
**Date:** 2026-04-24
**Scope:** 小规模内测（约 50 并发以下），公网开放 + 邀请码注册，端到端测试（含文件上传、数据处理、智能体流式输出、沙盒代码执行）
**Region:** 阿里云中国大陆地域

---

## 1. 架构与资源采购清单 (阿里云)

本方案采用**计算与存储/数据库分离**的标准架构，保证了内测期间的稳定性和数据安全，同时便于后续平滑扩容。

### 1.1 计算层 (ECS - 运行核心服务与沙盒)
* **实例规格**: `ecs.g8i.2xlarge` (8 vCPU, 32 GiB 内存) 或同等算力机型
  * *原因*: DeerFlow 的 Docker 生产栈 (Nginx + Frontend + Gateway + LangGraph) 加上并行的 Docker Sandbox 容器执行数据分析，内存消耗较大。16G 容易在并发生成图表/加载 Pandas 数据时 OOM，32G 是推荐起步线。
* **系统盘**: 100GB ESSD (预装 Ubuntu 22.04 LTS)
* **数据盘**: 200GB ESSD (挂载为 `/var/lib/docker` 或项目工作目录，用于存放沙盒镜像、分析产生的中间文件)
* **公网带宽**: 选用“按使用流量计费”，峰值带宽 10Mbps~20Mbps (应对用户频繁上传/下载数据表格的突发流量)

### 1.2 数据库与持久化层
由于采取分离架构，Gateway 和 LangGraph 的数据不再存放在容器的 SQLite 内。
* **PostgreSQL (RDS)**:
  * 规格: 2 核 4 GB (高可用版)
  * 用途: 存储 Better Auth 的用户注册/登录信息、积分账单、LangGraph Checkpoint (对话记忆)、会话元数据。
* **对象存储 (OSS)**:
  * 规格: 标准存储，按量付费即可。
  * 用途: 用于存放用户上传的原始数据 (`data_lalonde.csv` 等) 以及智能体生成的图表 (`plot.png`) 和清洗后的文件，避免占用 ECS 本地磁盘。
  * *注意*: 需要同时配置 OSS 跨域 (CORS) 供前端直接上传/下载，并申请一个内网 Endpoint 供 ECS 高速访问。

### 1.3 网络与安全
* **安全组策略**:
  * 入方向放行: `TCP 80` (HTTP), `TCP 443` (HTTPS), `TCP 22` (仅限管理员 IP SSH)
  * 其他内部端口 (`3000`, `8001`, `2024`) 严禁对公网开放。
* **域名与 HTTPS**:
  * 必须申请备案域名 (如 `app.deepresvalue.com`)。
  * 推荐在阿里云申请免费的 SSL 证书，并配置到 ECS 的 Nginx 中。

---

## 2. 服务部署拓扑

```text
[ 公网用户 ]
    │ (HTTPS / WSS 流式)
    ▼
[ Nginx (端口 443/80) ] ──(反向代理, 处理 SSL, WSS, CORS)
    │
    ├─► /api/langgraph/ ──► [ LangGraph 容器 (2024) ] ──► (调用本地 Docker Daemon 启动 Sandbox 容器)
    │
    ├─► /api/ ────────────► [ Gateway 容器 (8001) ]   ──► (读写 RDS PostgreSQL)
    │
    └─► / ────────────────► [ Frontend 容器 (3000) ]  ──► (Next.js, 与 Gateway 通信鉴权)
```

---

## 3. 部署与配置步骤

### 3.1 基础设施就绪
1. 在阿里云控制台购买上述资源 (ECS, RDS, OSS)。
2. 配置 RDS 白名单，仅允许该 ECS 的内网 IP 访问。
3. 域名解析 A 记录指向 ECS 公网 IP。

### 3.2 ECS 环境初始化
1. SSH 登录 ECS，更新系统并安装 Docker Engine & Docker Compose 插件。
2. 配置 Docker 的数据目录到数据盘 (修改 `/etc/docker/daemon.json`)。
3. Clone 代码: `git clone https://github.com/bytedance/deer-flow.git /data/deer-flow`。

### 3.3 配置文件修改
1. **生成密钥**: 运行 `openssl rand -base64 32` 生成 `BETTER_AUTH_SECRET`。
2. **修改环境变量 (`.env`)**:
   * 填入各类大模型 API Keys (OpenAI, DeepSeek 等)。
   * 修改数据库连接字符串，指向 RDS (PostgreSQL): `DATABASE_URL=postgresql://user:pass@rm-xxx.pg.rds.aliyuncs.com/deerflow`。
   * 修改存储配置，指向 OSS (需要在 config.yaml 中适配 S3 兼容或 OSS 插件)。
3. **修改 `config.yaml`**:
   * 配置 `sandbox.use: deerflow.community.aio_sandbox:AioSandboxProvider` (启用 Docker 沙盒隔离)。
   * 确保注册方式配置为邀请码/人工积分发放逻辑 (在 Gateway / Auth 模块对应配置中开启限制)。

### 3.4 启动与验证
1. 执行 `make up`，等待所有容器 Build 和启动。
2. 检查日志: `make docker-logs`，确认 Nginx, Frontend, Gateway, LangGraph 均无异常。
3. 访问域名 `https://app.deepresvalue.com`。

---

## 4. 测试用例 (Test Plan)

完成部署后，必须通过以下核心链路测试：
1. **鉴权与积分拦截**:
   * 未注册用户无法对话。
   * 新注册用户需要输入邀请码。
   * 积分耗尽后，API 返回错误，前端提示充值。
2. **端到端分析流**:
   * 上传测试集 `/workspace/deer-flow/StatsPAI/papers/data_lalonde.csv`。
   * 提问：“做双重差分(DID)分析，处理组为 treat，结果变量为 re78，协变量包括 age...”。
   * 验证：流式输出不断；沙盒成功在后台容器中启动并运算；成功返回最终分析报告与图表链接。
3. **压力与边界测试**:
   * 上传超大文件 (如 50MB CSV)，验证 Nginx `client_max_body_size` 是否会阻断。
   * 并发发起 10 个 DID 分析任务，监控 ECS 内存使用率，确保不发生 OOM。

---

## 5. 未决事项与风险 (TBD)
* 当前代码库对 OSS 的原生支持程度：需确认 `deer-flow` 的文件存储模块是否直接支持通过 S3 协议对接阿里云 OSS，否则需在 ECS 挂载 `ossfs` 或使用本地磁盘作为临时方案。
* 积分扣减的分布式一致性：在高并发下，依赖 PostgreSQL 的事务来保证积分不被超扣。