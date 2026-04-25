# 阿里云 SaaS 生产环境部署与基础设施方案 (Aliyun Deployment Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 DeerFlow SaaS 项目提供在阿里云（Aliyun）上的基础设施采购、配置与部署指南。特别关注：敏感信息（账号、积分）存入云数据库 RDS，而测试期的对话与文件先存储在 ECS 云服务器的本地磁盘中。

**Architecture:**
- **计算层 (Compute)**: 1台阿里云 ECS (Elastic Compute Service) 作为单机部署节点，运行 Frontend (Nginx/Node), Backend (FastAPI), 以及 Sandbox (Docker)。
- **数据层 (Database - 敏感信息)**: 阿里云 RDS for PostgreSQL (高可用版)。用于存储 `users`（账号密码）、`points_ledger`（积分流水）等核心资产，利用阿里云的自动备份和高可用保证数据绝对安全。
- **缓存层 (Cache)**: 阿里云 Redis (内网版)。用于 SSE 消息流转 (StreamBridge) 和并发限流 (Rate Limiting)。
- **存储层 (Storage - 临时文件)**: ECS 的挂载云盘 (ESSD)。前期测试阶段，所有用户的对话快照 (Checkpoints)、沙盒上传文件、智能体输出文件均存储在 ECS 的 `/mnt/deerflow-data/` 目录下。

**Tech Stack:** Aliyun ECS, Aliyun RDS (PostgreSQL), Aliyun Redis, Docker Compose, Nginx.

---

### 1. 核心原则：敏感数据与文件数据的分离策略

根据您的需求，我们采取**“数据分类分级”**的存储策略：

#### A. 敏感信息（必须放入阿里云 RDS PostgreSQL）
- **包含内容**：用户的账号、哈希加密后的密码（`bcrypt`）、积分余额（`points`）、充值流水（`points_ledger`）。
- **处理方式**：
  - 购买阿里云 **RDS for PostgreSQL** 实例（内网访问）。
  - 在应用层，我们的代码已经使用了 `SQLAlchemy` ORM。只需要在云服务器上将 `.env` 文件中的 `DATABASE_URL` 指向这个 RDS 的内网地址即可。
  - **安全性**：密码已经在代码层（Phase 1）使用 `bcrypt` 单向哈希加密，数据库管理员也无法看到明文。积分扣减使用了数据库事务和乐观锁，防止高并发下的“超卖”现象。RDS 提供按时间点恢复（PITR），即使误删数据也能找回。

#### B. 临时文件与对话记录（暂存阿里云 ECS 云服务器本地）
- **包含内容**：用户上传的 CSV/PDF 数据集、智能体（StatsExt 等）生成的数据分析图表、对话记录（LangGraph Checkpoints / memory.json 等）。
- **处理方式**：
  - 购买 ECS 时，除了系统盘，额外挂载一块 **ESSD 云盘**（例如 100GB，挂载到 `/mnt/deerflow-data/`）。
  - 在代码的 `.env` 中，将 `DEER_FLOW_HOME` 或相关的沙盒工作区路径指向这个挂载目录。
  - **优势**：测试期架构极简，无需马上对接复杂的对象存储（OSS）或 NAS 接口。读写速度极快。
  - **后续迁移计划**：测试无误后，可以通过阿里云官方工具（ossfs）将该目录无缝迁移到 OSS，或者在代码层面接入 S3 兼容的 SDK 进行云端存储改造。

---

### 2. 阿里云基础设施采购清单 (Shopping List)

> **💡 零成本数据库替代方案 (MVP 测试期推荐)**：
> 如果您在早期测试阶段不想额外付费购买阿里云 RDS 或 Redis，完全可以采取以下替代方案：
> 1. **ECS 容器化自建 (推荐)**：既然已经购买了 ECS 云服务器，我们可以直接在 ECS 上使用 Docker Compose 运行 PostgreSQL 和 Redis 容器。它们与主程序运行在同一台机器上，**完全免费**，且敏感数据依然保存在您自己的 ECS 数据盘中。
> 2. **海外免费 Serverless 数据库**：如注册 **Supabase** 或 **Neon** 账号，它们提供永久免费的 PostgreSQL 数据库，只需将获取的连接 URL 填入 `.env` 即可（缺点是国内访问可能存在网络延迟）。
> 3. **SQLite 单文件库**：系统代码原生支持 SQLite，无需任何配置，账号和积分数据会作为一个 `.db` 文件保存在本地。适用于极小规模的早期测试。

为了支持测试期到初期的正式上线，建议采购以下最低配置（后续可弹性升级）：

1. **云服务器 ECS (Elastic Compute Service)**
   - **规格**：`ecs.c7.xlarge` (4核 8G) 或 `ecs.g7.xlarge` (4核 16G)。因为本地需要跑 Docker 沙盒，内存建议 >= 8G。
   - **操作系统**：Ubuntu 22.04 LTS。
   - **磁盘**：40G 系统盘 + 100G 数据盘 (ESSD PL0)。数据盘用于存放前期的所有文件和对话记录。
   - **网络**：分配公网 IP，按使用流量计费（带宽峰值可设为 10Mbps-100Mbps）。

2. **云数据库 RDS (PostgreSQL)**
   - **版本**：PostgreSQL 14 或 15。
   - **系列**：高可用版（主备双节点），保证生产安全。
   - **规格**：2核 4G（初期足够使用）。
   - **网络**：必须与 ECS 在同一个专有网络（VPC）下，**不开启公网访问**，仅允许 ECS 内网连接。

3. **云数据库 Redis**
   - **版本**：Redis 7.0 社区版。
   - **架构**：标准架构（主备版）。
   - **规格**：1G 容量。
   - **网络**：同 VPC 内网访问。

4. **其他（可选/后续补充）**
   - **域名**：在阿里云注册并完成 ICP 备案（国内必须）。
   - **SSL 证书**：在阿里云数字证书管理服务申请免费 HTTPS 证书。
   - **负载均衡 ALB**：如果后期 ECS 扩容为多台，需购买 ALB。测试期可直接用 ECS 公网 IP + Nginx 暴露服务。

---

### 3. 部署架构与安全配置 (Security & Deployment)

#### 步骤 1：VPC 与安全组配置
1. 将 ECS、RDS、Redis 放入同一个 VPC（专有网络）中。
2. 配置 ECS 安全组：
   - **入方向**：仅开放 `80` (HTTP), `443` (HTTPS) 端口对公网 `0.0.0.0/0` 开放。
   - **入方向**：关闭 `22` (SSH) 端口的公网访问，改用阿里云控制台的“Session Manager（云助手）”进行安全免密登录；或仅对你本人的固定家庭/公司 IP 开放 22 端口。
3. 配置 RDS / Redis 白名单：
   - 仅允许 ECS 的内网 IP（或该 VPC 的网段，如 `172.16.0.0/16`）连接数据库，绝对禁止 `0.0.0.0/0`。

#### 步骤 2：ECS 基础环境初始化
登录到 ECS 后，执行以下操作：
1. **格式化并挂载数据盘**：
   ```bash
   mkfs.ext4 /dev/vdb
   mkdir -p /mnt/deerflow-data
   mount /dev/vdb /mnt/deerflow-data
   # 写入 /etc/fstab 实现开机自动挂载
   echo '/dev/vdb /mnt/deerflow-data ext4 defaults 0 0' >> /etc/fstab
   ```
2. **安装基础环境**：安装 Docker, Docker Compose, Nginx。

#### 步骤 3：部署应用
1. 将代码打包上传到 ECS（或在 ECS 上 git clone）。
2. 在项目根目录创建生产环境的 `.env` 文件：
   ```env
   # 指向阿里云内网 RDS
   DATABASE_URL=postgresql+psycopg2://<db_user>:<db_pass>@<rds_internal_endpoint>:5432/deerflow
   
   # 指向阿里云内网 Redis
   REDIS_URL=redis://:<redis_pass>@<redis_internal_endpoint>:6379/0

   # 所有对话和文件暂存到 ECS 数据盘
   DEER_FLOW_HOME=/mnt/deerflow-data/.deer-flow
   
   # 大模型 API Key
   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
   ```
3. 使用 `docker-compose.yaml`（项目中已有）启动后端 Gateway、LangGraph 引擎和前端服务。
4. 配置 Nginx 反向代理，将 80/443 端口流量转发给后端的 FastAPI (通常是 8000 端口) 和前端 (通常是 3000 端口)。

---

### 4. 后续迁移路径 (Future Migration to OSS)

当测试完成，业务逻辑稳定后，ECS 的本地磁盘会面临扩容和备份压力。此时需要进行“平滑迁移”：
1. **开通阿里云 OSS (对象存储)**。
2. 将 `/mnt/deerflow-data/` 中的历史文件通过阿里云 `ossutil` 工具同步到 OSS Bucket 中。
3. 在代码中修改上传与下载逻辑：不再写入本地磁盘，而是通过 AWS S3 SDK（兼容阿里云 OSS）或者阿里云官方 OSS SDK，生成预签名 URL (Presigned URL) 让前端直接上传/读取。
4. 届时，ECS 将变为完全无状态（Stateless）的计算节点，您可以随时销毁或增加 ECS 实例来应对流量高峰，所有数据都在 RDS 和 OSS 中安全托管。
