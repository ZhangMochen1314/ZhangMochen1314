# 项目打包与 SaaS 架构备份计划

## 目标
1. 将当前 `/workspace/DeepResValue` 项目打包为压缩包备份。
2. 撰写一份详细的 Markdown 文档 (`SAAS_ARCHITECTURE_BACKUP.md`)，详细讲解当前项目的 SaaS 架构、已有功能、源码结构、缺失部分以及下阶段的完善方向。

## 当前状态分析
DeepResValue 项目已经从一个本地单用户智能体框架，逐步重构和升级为一个具备多租户 SaaS 雏形的平台。当前包含了前后端分离的架构，支持 JWT 鉴权、积分计费中间件、多租户沙盒隔离，并且深度集成了高级数据分析模块（StatsPAI 和 StatsExt）。

## 提议的变更与执行步骤

### Step 1: 编写架构文档
**文件**: `/workspace/DeepResValue/SAAS_ARCHITECTURE_BACKUP.md`
**动作**: 写入详细的架构说明文档，包含以下结构：
- **项目整体架构 (Architecture)**：涵盖 Frontend (React), Backend (FastAPI + LangGraph), Database (PostgreSQL/SQLite), Sandbox (AioSandbox/E2B/Aliyun FC)。
- **SaaS 产品已有功能 (Current SaaS Capabilities)**：多租户隔离、JWT 登录注册、积分计费与拦截、高级多元数据分析技能等。
- **源代码结构解析 (Source Code Overview)**：解析 `backend/`、`frontend/`、`StatsPAI/`、`StatsExt/` 以及 `skills/` 等核心目录的作用。
- **当前缺失的组件 (Missing Components)**：支付网关接入（微信/支付宝）、前端计费与充值 UI、真实对象存储 (OSS) 的对接。
- **下阶段完善方向 (Next Steps)**：
  - **生产环境云端部署**：部署到云服务器（如阿里云 ECS 或火山引擎），数据库使用海外免费 Serverless（如 Neon）或自建 PostgreSQL。
  - **沙盒引擎的云原生升级**：重点考察**火山引擎 (Volcengine)** 提供的 Serverless 方案。例如使用火山引擎的 **veFaaS (函数计算)** 或 **VCI (弹性容器实例)** 来替代 E2B 和本地 Docker，实现毫秒级冷启动、按需计费的极致安全 Python 代码沙盒隔离。
  - **产品化与前端完善**：前端计费与充值 UI 接入（微信/支付宝等支付网关）、SaaS 官网落地页、真实对象存储 (OSS/TOS) 的对接。

### Step 2: 执行项目打包打包
**动作**: 运行 `zip` 命令将整个项目打包。
**命令**:
```bash
cd /workspace && zip -r DeepResValue_SaaS_Backup_20260424.zip DeepResValue -x "*/\.git/*" "*/__pycache__/*" "*/node_modules/*" "*/\.venv/*" "*/\.deer-flow/*"
```
**原因**: 排除 `.git`、缓存、依赖包和本地生成的临时沙盒文件，以减小压缩包体积，保证源码的纯净性。

## 假设与决策
- 架构文档 `SAAS_ARCHITECTURE_BACKUP.md` 将直接保存在项目根目录下，随同源码一起被打包。
- 打包文件名为 `DeepResValue_SaaS_Backup_20260424.zip`，存放在 `/workspace` 目录下。

## 验证步骤
1. 检查 `/workspace/DeepResValue/SAAS_ARCHITECTURE_BACKUP.md` 是否成功生成且内容完整。
2. 检查 `/workspace/DeepResValue_SaaS_Backup_20260424.zip` 是否成功生成，并且可以通过 `unzip -l` 验证其中排除了不必要的缓存和依赖文件夹。