# Coze 自动化部署指令

请按照以下步骤连接服务器并部署 DeepResValue：

## 服务器信息
- IP 地址：`121.199.9.224`
- SSH 端口：`2222`
- 用户名：`root`
- 密码：`DeepResValue@2026`

## 自动化执行步骤
1. **上传文件**：将接收到的 `deploy_package.tar.gz` 上传至服务器的 `/root/` 目录。
2. **解压文件**：
   ```bash
   cd /root/
   tar -xzf deploy_package.tar.gz
   ```
3. **进入项目目录**：
   ```bash
   cd /root/deer-flow
   ```
4. **添加执行权限**：
   ```bash
   chmod +x scripts/deploy-aliyun.sh
   ```
5. **执行部署脚本**：
   ```bash
   ./scripts/deploy-aliyun.sh
   ```

当脚本执行完毕并显示 `Deployment Complete!` 后，请回复用户：“部署已完成，可以通过 http://121.199.9.224:2026 访问系统。”