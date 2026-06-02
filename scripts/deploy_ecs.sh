#!/usr/bin/env bash
set -euo pipefail

repo_dir="${DEERFLOW_REPO_DIR:-/var/www/deepresvalue/deer-flow}"
branch="${DEPLOY_BRANCH:-DeepResValue_V3.5}"

cd "$repo_dir"

if [[ -f /root/.ssh/deepresvalue_github_ed25519 ]]; then
  mkdir -p /root/.ssh
  touch /root/.ssh/known_hosts
  chmod 600 /root/.ssh/known_hosts
  ssh-keyscan github.com >> /root/.ssh/known_hosts 2>/dev/null || true
  export GIT_SSH_COMMAND="ssh -i /root/.ssh/deepresvalue_github_ed25519 -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=/root/.ssh/known_hosts"
fi

git fetch origin "$branch"
git checkout "$branch"
git pull --ff-only origin "$branch"

backend/scripts/migrate_postgres.sh

systemctl restart deer-flow.service
systemctl is-active deer-flow.service >/dev/null

ok=0
for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:8000/api/health >/dev/null; then
    ok=1
    break
  fi
  sleep 1
done
if [[ "$ok" != "1" ]]; then
  exit 7
fi

echo "deploy ok"
