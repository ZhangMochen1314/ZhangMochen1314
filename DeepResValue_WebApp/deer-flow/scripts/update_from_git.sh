#!/bin/bash
# 阿里云 ECS 端一键 Git 同步与重启脚本
# 请将此脚本放在 ECS 的 /var/www/deepresvalue/ 目录下执行

echo "========================================="
echo " 开始从 Git 仓库拉取最新代码并热更服务"
echo "========================================="

# 进入项目目录
cd /var/www/deepresvalue/DeepResValue_WebApp/deer-flow || { echo "未找到项目目录！"; exit 1; }

echo "[1/3] 从 Git 拉取最新代码..."
# 放弃本地未提交的修改，强制与远端保持一致（视需要可取消注释下面这行）
# git reset --hard HEAD
git pull

echo "[2/3] 正在重启后端服务..."
sudo systemctl restart deepresvalue-backend

echo "[3/3] 检查前端是否需要重新构建..."
# 简单的判断：如果 frontend 目录下的代码有更新，可以手动执行 npm run build
# 这里提供一键命令，如果有前端修改，您可以直接在命令行输入 y 确认构建
read -p "是否需要重新构建前端静态页面？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "正在构建前端产物..."
    cd frontend
    npm install
    npm run build
    sudo systemctl restart nginx
    cd ..
fi

echo "========================================="
echo " 云端服务已成功更新并重启！🚀"
echo "========================================="
