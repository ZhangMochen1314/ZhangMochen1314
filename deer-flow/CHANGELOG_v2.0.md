# DeepResValue WebApp - Release v2.0 更新日志 (Changelog)

相较于第一个发布版本 (`DeepResValue_WebApp_Release_v1.0.tar.gz`)，当前版本 (v2.0) 进行了深度的重构与功能扩展，重点加强了商业化 SaaS 属性、大文件处理能力以及智能体的回答稳定性。以下是核心更新内容：

## ✨ 新特性 (New Features)

1. **多租户与 RBAC 鉴权体系**
   - 引入了基于 PostgreSQL 和 JWT 的多租户鉴权体系，实现数据与会话隔离。
   - 新增了完善的前端登录与注册视图。
   - 实现了基于角色的访问控制（RBAC），新增管理员（Admin）专属路由与权限拦截。

2. **高阶科研文件智能解析管道**
   - 增强了沙盒解析能力，现支持 `.zip` 递归解压。
   - 新增了使用 `pyreadstat` 和 `geopandas` 解析 `.sav`、`.dta` 数据字典及 `.shp` 空间边界文件的支持。

3. **云原生存储与预签名直传 (Presigned URL)**
   - 集成阿里云 OSS 对象存储服务。
   - 将本地文件上传机制彻底改造为预签名的前端直传模式，大幅降低后端网络与内存压力，支持 GB 级超大文件秒传。

## 🏗 架构调整 (Architectural Changes)

1. **废弃 `<citations>` 标签机制**
   - 彻底废弃了复杂且容易引发大模型幻觉的 `<citations>` JSONL 块引用解析系统。
   - 前端改用轻量级的 `MarkdownContent` 组件，直接渲染标准 Markdown 语法。
   - 统一了大模型 Prompt，改用标准 Markdown 链接语法 `[文件名](URL)` 作为来源引用。

2. **云原生部署拓扑**
   - 从纯单机 SQLite 架构，迁移至计算与存储分离的云原生部署拓扑（ECS + RDS + OSS + Redis 分离）。
   - 引入 `RedisStreamBridge` 替换内存队列，支持网关多实例横向扩展与高可用。

3. **沙盒与资源管理增强**
   - 强化了 Docker Sandbox 沙盒在执行重度分析任务（如 StatsPAI）时的隔离与内存限制管理。
   - 引入了限流机制（Rate Limiting），防止接口滥用。

## 🐛 问题修复 (Fixes)

1. **技能与插件冲突修复**
   - 修复了 `public` 与 `custom` 目录下同名技能导致的状态相互覆盖冲突，将底层的配置键值平滑升级为 `{category}:{name}` 组合键。
   - 增强了 `/api/skills` 接口，在加载与安装阶段加入了严密的类别内防重名强校验机制。

2. **Artifact 资源下载逻辑精简**
   - 修复并精简了 Artifact 的下载与展示逻辑。
   - 移除了后端下载接口中极易引发乱码的“正则剔除引用格式”操作，统一使用标准的 `FileResponse` 安全下发原始文件。
