#!/bin/bash

REPO_DIR="/workspace/StatsPAI"
cd $REPO_DIR || exit 1

echo "=================================================="
echo "开始实时追踪 StatsPAI 项目更新... (按 Ctrl+C 停止)"
echo "=================================================="

# 记录当前的最新 commit
current_commit=$(git rev-parse HEAD)

while true; do
    # 获取远程最新状态
    git fetch origin main -q

    # 获取远程分支的最新 commit
    remote_commit=$(git rev-parse origin/main)

    # 比较本地和远程的 commit 是否一致
    if [ "$current_commit" != "$remote_commit" ]; then
        echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')] 发现新更新！"
        
        # 显示更新的 commit 日志
        echo "更新内容如下："
        git log $current_commit..$remote_commit --oneline --color=always
        
        # 拉取最新代码
        echo "正在拉取最新代码..."
        git pull origin main -q
        echo "代码已更新至最新版本。"
        
        # 更新当前 commit 记录
        current_commit=$remote_commit
    fi
    
    # 每隔 60 秒检查一次（可根据需要修改）
    sleep 60
done
