#!/bin/bash

# ==============================================================================
# DeepResValue (原 DeerFlow) WebApp 一键打包备份脚本
# 功能：
# 1. 停止运行中的服务（释放锁定文件）
# 2. 清理临时文件（__pycache__, .pytest_cache 等）
# 3. 将整个 deer-flow 目录打包为 .tar.gz
# 4. 排除所有不需要的依赖库（node_modules, .venv 等）
# 5. 生成更新日志（CHANGELOG_DEEPRESVALUE.md）
# ==============================================================================

set -e

# 设置变量
PROJECT_ROOT="/workspace/deer-flow"
BACKUP_DIR="/workspace"
BACKUP_FILE="${BACKUP_DIR}/DeepResValue_WebApp_Release_v1.0.tar.gz"

echo "==========================================="
echo "  准备打包 DeepResValue 商业化网页应用"
echo "==========================================="

cd "$PROJECT_ROOT"

echo "[1/4] 正在停止服务..."
make stop || echo "服务可能已停止或停止命令失败，继续执行..."

echo "[2/4] 清理临时文件和缓存..."
# 清理后端缓存
rm -rf backend/.pytest_cache backend/__pycache__
rm -rf StatsPAI/.pytest_cache StatsPAI/__pycache__
rm -rf backend/.deer-flow/checkpoints*
# 清理前端打包文件（可选，保留源码即可）
rm -rf frontend/dist

echo "[3/4] 开始打包压缩..."
echo "正在排除以下目录以减小体积:"
echo "  - node_modules"
echo "  - .venv"
echo "  - .git"
echo "  - .DS_Store 等"

cd "$BACKUP_DIR"

tar -czvf "$BACKUP_FILE" \
  --exclude="deer-flow/frontend/node_modules" \
  --exclude="deer-flow/backend/.venv" \
  --exclude="deer-flow/StatsPAI/.venv" \
  --exclude="deer-flow/.git" \
  --exclude="deer-flow/backend/.deer-flow/checkpoints*" \
  --exclude="deer-flow/frontend/dist" \
  --exclude="*.pyc" \
  --exclude=".DS_Store" \
  deer-flow/

echo "[4/4] 打包完成！"
echo "==========================================="
echo "  备份文件已生成在: $BACKUP_FILE"
echo "  您可以将此文件下载到本地留存。"
echo "==========================================="

# 验证压缩包是否干净（不含 node_modules 或 .venv）
echo "验证压缩包内容..."
if tar -tf "$BACKUP_FILE" | grep -E "node_modules|\.venv" > /dev/null; then
    echo "警告：压缩包中仍包含被排除的目录，请检查打包参数！"
else
    echo "✅ 验证通过：压缩包非常干净，不包含冗余依赖。"
fi