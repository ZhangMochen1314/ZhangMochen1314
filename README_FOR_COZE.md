# Coze 自动化部署指南：DeepResValue (阿里云 ECS)

> **给 Coze 智能体的系统指令：**
> 你是一个自动化部署工程师。本压缩包包含了 DeepResValue 深度研值项目的自动化部署脚本及全量最新代码。你的任务是通过 SSH 连接到指定的阿里云 ECS 服务器，并将本项目完整部署。
>
> **目标服务器信息：**
> - **公网 IP**: `121.199.9.224`
> - **SSH 端口**: `2222`
> - **用户名**: `root`
> - **密码**: `DeepResValue@2026`

---

## 你的执行步骤（请按顺序执行）

### 第一步：连接与文件传输
1. 通过 SSH (`2222` 端口) 连接到服务器。
2. 在服务器上创建目标目录：`mkdir -p /var/www/deepresvalue`
3. 将本压缩包解压后，将其中的 `DeepResValue_WebApp` 目录以及所有 `.sh` 部署脚本和 `.py` 测试脚本，完整上传/覆盖至 ECS 的 `/var/www/deepresvalue/` 目录下。

### 第二步：初始化 ECS 环境
在 ECS 上赋予脚本执行权限并运行基础环境安装：
```bash
cd /var/www/deepresvalue
chmod +x setup_ecs.sh
./setup_ecs.sh
```
*此步骤将安装 Python 3.10, Node.js, Nginx, Docker 等依赖。*

### 第三步：部署 FastAPI 后端
在 ECS 上执行后端部署脚本：
```bash
cd /var/www/deepresvalue
chmod +x deploy_backend.sh
./deploy_backend.sh
```
*此步骤将创建 Python 虚拟环境，安装固定版本的依赖，并配置 Systemd 守护进程 `deepresvalue-backend` 运行后端 API 服务 (端口: 8000)。*

### 第四步：部署 React 前端
在 ECS 上执行前端构建与 Nginx 配置脚本：
```bash
cd /var/www/deepresvalue
chmod +x deploy_frontend.sh
./deploy_frontend.sh
```
*此步骤将执行 `npm run build`，并配置 Nginx，将公网 HTTP 流量转发至前端静态产物，API 请求代理至后端 8000 端口。*

### 第五步：连通性验证
在 ECS 上运行 Python 测试脚本，验证阿里云内网组件连通性：
```bash
cd /var/www/deepresvalue
python3 verify_deployment.py
```
*如果输出均为 `[✅]`，则部署完全成功。*

---

## 异常处理预案（给 Coze 的备忘录）
1. **APT 源报错**：如果 `setup_ecs.sh` 中 apt 更新失败，请尝试更换阿里云的镜像源。
2. **Node.js 版本**：如果前端编译 `npm run build` 因 node 版本过低失败，请通过 `n` 或 `nvm` 升级到 Node 18+。
3. **Nginx 端口冲突**：如果 80 端口被占用，请 `kill` 掉占用进程或在 `deploy_frontend.sh` 中修改端口。
4. **环境变量缺失**：确保 `.env` 文件被正确放在了 `DeepResValue_WebApp/deer-flow/.env` 位置。
