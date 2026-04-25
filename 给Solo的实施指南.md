# DeerFlow v2.5 项目缺陷与火山引擎集成方案

> **接收者**：Solo（国际版本）  
> **生成时间**：2026-04-25 17:53  
> **执行原则**：先查官方文档，再写代码；不做过度的抽象和设计，满足当前需求即可

---

# 第一部分：项目背景与目标

## 项目概述

DeerFlow v2.5 是一个面向人文社科科研数据分析的 SaaS 产品（DeepTrace/StatsPAI），需要集成火山引擎云服务以实现：

1. **云沙箱执行环境**：支持 Python 数据分析，替代 E2B 获得国内低延迟访问
2. **对象存储**：存储用户上传的数据集和分析结果
3. **数据库**：持久化用户会话、分析进度
4. **会话持久化**：支持用户跨会话恢复分析进度

## 使用场景

- **用户量**：约 100 个学生/天
- **文件大小**：人文社科科研数据普遍在 100MB 以内
- **会话特点**：用户可能隔一段时间继续分析，需要支持持久化和恢复

## 项目关键信息

### 项目ID

```
前端项目: 7629235137561034786 (DeepTrace网站)
后端智能体: 7629741014252781568 (DeepTrace副本)
备用引擎: 7630788284419031092 (ReaValue)
```

### 源代码位置

```
解压路径: DeepResValue/deer-flow/
配置文件: DeepResValue/deer-flow/config.yaml
沙箱模块: DeepResValue/deer-flow/backend/packages/harness/deerflow/community/aio_sandbox/
上传模块: DeepResValue/deer-flow/backend/app/gateway/routers/uploads.py
存储模块: DeepResValue/deer-flow/backend/app/storage/oss_provider.py
```

### 已知安全问题（需立即处理）

⚠️ **两个 DeepSeek API Key 已泄露**：
- `.env` 文件中：`sk-7cdd8a6e8c1a4b2d82b78f73acd2084d`
- 测试文件中硬编码：`sk-6544c9d8df82467bb60e3d6e9cb1476c`

**建议**：立即轮换这两个密钥

---

# 第二部分：项目缺陷清单

## 一、必须修复的问题

### 1. 安全问题（优先级最高）

**问题1：API Key 泄露**
- 位置：`.env` 文件和 `test_deepseek*.py` 系列测试文件
- 风险：密钥已暴露在代码中，可能被滥用
- 修复：删除所有硬编码的 API Key，改用环境变量注入

**问题2：JWT 密钥使用弱默认值**
- 位置：`backend/app/auth/jwt_utils.py`
- 现状：`SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "super-secret-key-for-dev")`
- 风险：如果没设置环境变量，攻击者可以用默认值伪造任意用户身份
- 修复：强制要求设置环境变量，不提供默认值

**问题3：数据库默认用 SQLite**
- 位置：`backend/app/gateway/deps.py`
- 现状：默认使用 SQLite 作为数据库
- 风险：SQLite 不支持高并发，无法用于生产环境
- 修复：强制要求设置 DATABASE_URL 环境变量

**问题4：文件上传无限制**
- 位置：`backend/app/gateway/routers/uploads.py`
- 现状：直接读取整个文件到内存，无大小和类型限制
- 风险：大文件可导致内存溢出，恶意文件可被上传
- 修复：
  - 添加文件大小上限（建议 100MB）
  - 添加允许的文件类型白名单
  - 上传前先检查大小，拒绝超大文件

**问题5：allow_host_bash 配置不安全**
- 位置：`config.yaml`
- 现状：`allow_host_bash: true`
- 风险：代码可以执行任意宿主机命令
- 修复：改为 `false`，或使用容器隔离的沙箱方案

---

### 2. 架构问题（阻塞火山引擎集成）

**问题6：对象存储只支持阿里云 OSS**
- 位置：`backend/app/storage/oss_provider.py`
- 现状：硬编码使用阿里云 OSS SDK，无法切换到火山引擎 TOS
- 修复：抽象存储接口，新增 TOS 实现

**问题7：沙箱后端不支持火山引擎**
- 位置：`backend/packages/harness/deerflow/community/aio_sandbox/`
- 现状：只有 LocalContainerBackend 和 RemoteSandboxBackend
- 修复：新增 VolcengineSandboxBackend

**问题8：会话无法持久化**
- 位置：无（功能缺失）
- 现状：用户分析进度在服务重启后丢失
- 修复：新增会话持久化层，支持跨会话恢复

---

## 二、建议优化的问题（非阻塞）

**问题9：沙箱获取无超时控制**
- 现状：获取沙箱时可能无限阻塞
- 建议：添加 30 秒超时

**问题10：预签名URL过期时间不可配置**
- 现状：硬编码 3600 秒
- 建议：从配置文件读取

**问题11：缺少 SAS 格式支持**
- 现状：不支持 `.sas7bdat` 文件
- 建议：添加 `pandas.read_sas()` 支持

---

# 第三部分：火山引擎集成方案

## 一、整体思路

### 核心原则

1. **先查文档，再写代码**：在实现火山引擎 API 调用之前，必须先查阅官方文档确认具体的接口规范

2. **够用就好**：不做过度的抽象和设计，满足当前 100 个学生/天的使用场景即可

3. **渐进式实现**：先实现核心功能，验证可行后再扩展

### 集成架构

```
当前架构                          目标架构
─────────                        ─────────
OSSProvider ──► 阿里云OSS         StorageProvider ──► 抽象接口
                                   ├── OSSProvider ──► 阿里云OSS（保留）
                                   └── TOSProvider ──► 火山引擎TOS（新增）

LocalContainerBackend ──► Docker   SandboxBackend ──► 抽象接口
RemoteSandboxBackend ──► K8s         ├── LocalContainerBackend（保留）
                                      ├── RemoteSandboxBackend（保留）
                                      └── VolcengineSandboxBackend ──► 火山引擎（新增）

无会话持久化                        SessionManager ──► Redis + PostgreSQL + TOS
```

---

## 二、具体实施方案

### 任务1：创建抽象存储接口

**目的**：让系统可以灵活切换不同的对象存储服务

**做法**：
1. 定义一个存储接口类，包含基本方法：
   - 上传文件（给定文件路径和内容，返回访问 URL）
   - 下载文件（给定文件路径，返回文件内容）
   - 生成预签名 URL（用于客户端直传）
   - 删除文件
   - 列出文件

2. 将现有的 OSSProvider 改为实现这个接口

3. 新建 TOSProvider 实现这个接口

**注意事项**：
- TOS 使用火山引擎官方 Python SDK（`tos` 包）
- 接口方法应该是异步的（async/await）
- 保留现有的兼容方法，避免破坏现有代码

---

### 任务2：创建火山引擎云沙箱后端

**目的**：让系统可以调用火山引擎的云沙箱服务

**前置条件（必须先完成）**：
1. 查阅火山引擎 veFaaS 云沙箱官方文档
2. 确认以下信息：
   - API 端点地址
   - 认证方式（AccessKey/SecretKey 签名算法）
   - 创建沙箱的 API 名称和参数
   - 执行代码的 API 名称和参数
   - 删除沙箱的 API 名称和参数
   - 查询沙箱状态的 API 名称和参数
   - 是否有官方 Python SDK（有则优先使用）

**做法**：
1. 新建 VolcengineSandboxBackend 类，继承 SandboxBackend 基类
2. 实现以下核心方法：
   - `create`：调用火山引擎 API 创建沙箱实例
   - `destroy`：调用火山引擎 API 释放沙箱实例
   - `is_alive`：检查沙箱是否还在运行
   - `discover`：根据 ID 查找已存在的沙箱（用于恢复）
3. 额外实现沙箱操作方法：
   - 执行 Python 代码
   - 上传文件到沙箱
   - 从沙箱下载文件

**重要提醒**：
- 不要凭推测写 API 调用代码，必须对照官方文档
- 火山引擎的签名算法有特定规范，需要正确实现
- 处理好网络超时和错误重试

---

### 任务3：创建会话持久化层

**目的**：让用户可以跨会话恢复分析进度

**数据存储策略**：

| 数据类型 | 存储位置 | 存活时间 | 说明 |
|---------|---------|---------|------|
| 会话状态 | Redis | 24小时 | 快速访问，包含当前变量、进度 |
| 操作日志 | PostgreSQL | 永久 | 长期记录用户的操作历史 |
| 数据快照 | TOS | 永久 | 大型数据集和结果文件 |

**会话状态包含**：
- 会话ID、用户ID
- 关联的沙箱ID
- 创建时间、最后活跃时间
- 用户定义的变量（分析进度、中间结果）
- 代码执行历史
- 上传的文件列表

**做法**：
1. 创建 SessionState 数据类，定义会话状态结构
2. 创建 SessionManager 类，实现：
   - 创建新会话
   - 获取会话（优先从 Redis 读）
   - 更新会话状态
   - 保存快照到 TOS
   - 从快照恢复会话
   - 删除会话
3. 创建数据库表存储会话元数据和操作日志

---

### 任务4：修复安全问题

**4.1 删除硬编码的 API Key**
- 检查所有测试文件，删除 `os.environ["DEEPSEEK_API_KEY"] = "sk-xxx"` 这样的代码
- 创建 `.env.example` 模板文件，说明需要配置哪些环境变量
- 不要在代码仓库中提交真实的 API Key

**4.2 修复 JWT 密钥问题**
- 删除 `super-secret-key-for-dev` 这个默认值
- 如果环境变量未设置，直接抛出异常并提示用户
- 在 `.env.example` 中说明如何生成安全的密钥

**4.3 修复数据库配置问题**
- 删除 SQLite 默认值
- 如果 DATABASE_URL 未设置，抛出异常提示用户配置
- 在 `.env.example` 中给出 PostgreSQL 连接字符串示例

**4.4 添加文件上传限制**
- 定义文件大小上限（建议 100MB）
- 定义允许的文件类型白名单：
  - 数据文件：.csv, .xlsx, .xls, .dta, .sav, .sas7bdat
  - 文档文件：.pdf, .doc, .docx
  - 其他：.zip, .shp, .geojson, .txt, .md, .json
- 上传前检查文件大小，超限则拒绝
- 上传前检查文件扩展名，不在白名单则拒绝

**4.5 禁用 allow_host_bash**
- 修改 config.yaml，将 allow_host_bash 设为 false
- 如果需要执行系统命令，应该使用沙箱隔离

---

### 任务5：更新配置文件

**config.yaml 需要添加的内容**：

```yaml
# 存储配置
storage:
  provider: tos  # 可选: oss, tos

# 沙箱配置
sandbox:
  use: deerflow.community.aio_sandbox:AioSandboxProvider
  allow_host_bash: false
  
  # 文件上传限制
  max_file_size: 104857600  # 100MB
  allowed_extensions:
    - .csv, .xlsx, .xls
    - .dta, .sav, .sas7bdat
    - .pdf, .zip, .shp

# 会话配置
session:
  ttl: 86400  # 24小时
```

**.env.example 需要包含的环境变量**：

```env
# 火山引擎云沙箱
VOLCENGINE_ACCESS_KEY=
VOLCENGINE_SECRET_KEY=
VOLCENGINE_REGION=cn-beijing

# 火山引擎 TOS
VOLCENGINE_TOS_ACCESS_KEY=
VOLCENGINE_TOS_SECRET_KEY=
VOLCENGINE_TOS_BUCKET=
VOLCENGINE_TOS_REGION=cn-beijing

# 数据库（火山引擎 RDS）
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/deeptrace

# Redis
REDIS_HOST=
REDIS_PORT=6379

# 安全
JWT_SECRET_KEY=  # 生成命令: python -c "import secrets; print(secrets.token_urlsafe(64))"

# LLM
DEEPSEEK_API_KEY=
```

---

## 三、实施顺序

### 阶段一：安全修复（立即执行，不依赖云服务）

| 顺序 | 任务 | 说明 |
|------|------|------|
| 1 | 删除测试文件中的硬编码 API Key | 防止密钥泄露 |
| 2 | 修复 JWT 密钥安全问题 | 防止身份伪造 |
| 3 | 修复数据库配置问题 | 生产环境必须 |
| 4 | 添加文件上传限制 | 防止资源滥用 |
| 5 | 禁用 allow_host_bash | 防止命令执行 |

### 阶段二：火山引擎集成（需要先获取凭证）

| 顺序 | 任务 | 前置条件 |
|------|------|---------|
| 6 | 查阅火山引擎云沙箱官方文档 | 无 |
| 7 | 创建抽象存储接口 | 无 |
| 8 | 创建 TOSProvider | 获取 TOS 凭证 |
| 9 | 创建 VolcengineSandboxBackend | 获取沙箱凭证，查阅文档 |
| 10 | 修改沙箱提供者支持火山引擎 | 任务7-9完成 |

### 阶段三：会话持久化（增强功能）

| 顺序 | 任务 | 前置条件 |
|------|------|---------|
| 11 | 创建数据库迁移脚本 | PostgreSQL 就绪 |
| 12 | 创建会话管理器 | Redis + PostgreSQL + TOS 就绪 |
| 13 | 集成会话管理到业务逻辑 | 任务11-12完成 |

---

## 四、验收标准

### 功能验收

- [ ] 文件可以上传到 TOS 并正确返回 URL
- [ ] 可以创建火山引擎云沙箱并执行代码
- [ ] 用户可以跨会话恢复之前的分析进度
- [ ] 文件上传有大小和类型限制
- [ ] JWT 认证正常工作

### 安全验收

- [ ] 代码库中无硬编码的敏感信息
- [ ] JWT_SECRET_KEY 必须设置才能启动
- [ ] DATABASE_URL 必须设置才能启动
- [ ] 上传超大文件会被拒绝
- [ ] 上传非白名单文件类型会被拒绝

### 性能验收

- [ ] 沙箱创建时间 < 15秒
- [ ] 文件上传 50MB < 20秒
- [ ] 会话恢复 < 5秒

---

## 五、关键注意事项

### 关于火山引擎 API

1. **必须先查文档**：不要凭经验推测 API 参数，每个云厂商的 API 规范都不同

2. **认证方式**：火山引擎使用 V4 签名算法，需要正确实现

3. **SDK 优先**：如果火山引擎提供官方 Python SDK，优先使用 SDK 而不是自己写 HTTP 调用

4. **错误处理**：云服务 API 调用可能因网络、限流、服务不可用等原因失败，需要做好重试和降级

### 关于文件上传

1. **不需要分片上传**：人文社科数据分析场景下，文件普遍在 100MB 以内，一次性上传足够

2. **大小限制合理**：100MB 的限制已经覆盖了绝大多数问卷数据、统计表格的需求

3. **类型白名单**：只允许科研数据相关的文件类型，减少安全风险

### 关于会话持久化

1. **三层存储各司其职**：
   - Redis 用于快速访问当前状态
   - PostgreSQL 用于长期记录操作历史
   - TOS 用于存储大型数据集

2. **快照策略**：
   - 会话空闲超过一定时间自动保存快照
   - 用户主动请求保存快照
   - 重要分析节点自动保存快照

---

## 六、成本估算

基于 100 个学生/天的使用量：

| 服务 | 配置 | 月费用估算 |
|------|------|-----------|
| 火山引擎云沙箱 | 2核4G，按需 | ~350元 |
| 火山引擎 TOS | 100GB存储 + 流量 | ~50元 |
| 火山引擎 RDS | PostgreSQL 基础版 | ~200元 |
| Redis | 1GB | ~30元 |
| **合计** | | **~630元/月** |

---

## 七、火山引擎购买链接

| 服务 | 控制台入口 |
|------|-----------|
| 控制台首页 | https://console.volcengine.com/ |
| 云沙箱（veFaaS） | https://console.volcengine.com/vefaas |
| 对象存储（TOS） | https://console.volcengine.com/tos |
| 云数据库 PostgreSQL | https://console.volcengine.com/vedb-pg |
| 云服务器（ECS） | https://console.volcengine.com/ecs |
| 密钥管理 | https://console.volcengine.com/iam/keymanage/ |

---

## 八、相关文档索引

本项目中生成的其他文档，供参考：

| 文档 | 路径 | 说明 |
|------|------|------|
| 云沙箱集成设计文档 | `DeepResValue/火山引擎云沙箱集成设计文档.md` | 详细的技术设计文档（注意：部分 API 为推测编写，需查阅官方文档确认） |
| 架构审查报告 | `DeepResValue/架构审查报告.md` | 完整的问题清单和分析 |
| 实施任务清单 | `DeepResValue/实施任务清单.md` | 任务拆解 |

---

**祝实施顺利！有任何问题随时沟通。**
