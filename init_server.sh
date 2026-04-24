#!/bin/bash
set -e

echo "=============================================="
echo "    开始初始化 SaaS 服务器环境 (Ubuntu 22.04) "
echo "=============================================="

# 1. 更新系统包
echo ">>> 1. 正在更新系统包..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. 安装基础工具
echo ">>> 2. 正在安装基础工具..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common git vim htop wget

# 3. 安装 Docker
echo ">>> 3. 正在安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    # 启动 Docker 并设置开机自启
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker 已安装，跳过。"
fi

# 4. 安装 Docker Compose
echo ">>> 4. 正在安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose 已安装，跳过。"
fi

# 5. 配置 Docker 镜像加速 (阿里云)
echo ">>> 5. 正在配置 Docker 阿里云镜像加速..."
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

# 6. 检查安装结果
echo "=============================================="
echo "环境初始化完成！以下是安装结果："
docker --version
docker-compose --version
echo "=============================================="
echo "您的服务器已经准备好进行 SaaS 应用部署了！"
