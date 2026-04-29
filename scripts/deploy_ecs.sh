#!/usr/bin/env bash
set -euo pipefail

repo_dir="${DEERFLOW_REPO_DIR:-/var/www/deepresvalue/deer-flow}"
branch="${DEPLOY_BRANCH:-DeepResValue_V3.5}"

cd "$repo_dir"

git fetch origin "$branch"
git checkout "$branch"
git pull --ff-only origin "$branch"

backend/scripts/migrate_postgres.sh

systemctl restart deer-flow.service
sleep 2
systemctl is-active deer-flow.service >/dev/null
curl -fsS http://127.0.0.1:8000/api/health >/dev/null

echo "deploy ok"
