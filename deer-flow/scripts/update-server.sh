#!/bin/bash
set -e

echo "==========================================="
echo "  DeepResValue (DeerFlow) Auto Update"
echo "==========================================="

# 确保在正确的目录下
if [ ! -d "deer-flow" ] && [ ! -d "docker" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本 (应该包含 docker 或 deer-flow 文件夹)"
    exit 1
fi

echo "📥 1. 正在从 GitHub 拉取最新代码..."
git fetch origin
# 获取当前分支名称
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
# 强制覆盖本地修改，拉取远程最新代码
git reset --hard origin/$CURRENT_BRANCH
echo "✅ 代码拉取完成！当前分支: $CURRENT_BRANCH"

echo "🔄 2. 正在重新构建并重启 Docker 容器..."
# 如果在 deer-flow 外层，进入 deer-flow
if [ -d "deer-flow" ]; then
    cd deer-flow
fi

cd docker
# 停止当前运行的容器
docker-compose -f docker-compose.prod.yml down
# 重新构建镜像（利用缓存，如果有依赖变更则会重新安装）
docker-compose -f docker-compose.prod.yml build
# 启动容器
docker-compose -f docker-compose.prod.yml up -d

echo "==========================================="
echo "  🎉 更新部署完成！服务已重新启动。"
echo "  您可以在浏览器中刷新 http://121.199.9.224:2026 查看效果。"
echo "==========================================="
