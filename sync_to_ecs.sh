#!/bin/bash
# DeepResValue 一键增量同步脚本 (本地 -> 阿里云 ECS)

# ECS 服务器信息
HOST="121.199.9.224"
PORT="2222"
USER="root"
PASS="DeepResValue@2026"
REMOTE_DIR="/var/www/deepresvalue/DeepResValue_WebApp"

# 检查 sshpass 是否安装
if ! command -v sshpass &> /dev/null; then
    echo "Error: sshpass 未安装。请先执行 'sudo apt install sshpass' 或 'brew install hudochenkov/sshpass/sshpass'"
    exit 1
fi

echo "========================================="
echo " 开始将本地代码增量同步到云服务器..."
echo " 目标: $USER@$HOST:$PORT"
echo "========================================="

# 使用 rsync 增量同步，排除不需要同步的目录和文件
sshpass -p "$PASS" rsync -avz --delete -e "ssh -p $PORT -o StrictHostKeyChecking=no" \
    --exclude="node_modules" \
    --exclude="venv" \
    --exclude=".venv" \
    --exclude="__pycache__" \
    --exclude=".git" \
    --exclude="dist" \
    --exclude=".DS_Store" \
    --exclude=".deer-flow/checkpoints.db" \
    --exclude=".deer-flow/checkpoints.db-shm" \
    --exclude=".deer-flow/checkpoints.db-wal" \
    /workspace/DeepResValue_WebApp/ $USER@$HOST:$REMOTE_DIR/

if [ $? -eq 0 ]; then
    echo "========================================="
    echo " 同步成功！✅"
    echo " 正在自动重启云端后端服务以应用更改..."
    
    # 自动重启后端的 Systemd 服务
    sshpass -p "$PASS" ssh -p $PORT -o StrictHostKeyChecking=no $USER@$HOST "systemctl restart deepresvalue-backend"
    
    echo " 云端服务已重启，请在网页端测试最新代码！🚀"
    echo " (如果是前端修改，您可能需要在云端执行: cd $REMOTE_DIR/deer-flow/frontend && npm run build)"
    echo "========================================="
else
    echo " 同步失败！❌"
fi
