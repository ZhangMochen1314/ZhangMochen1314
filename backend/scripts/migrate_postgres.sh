#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
sql="$repo_root/backend/scripts/reconcile_schema_postgres.sql"

if [[ ! -f "$sql" ]]; then
  echo "ERROR: migration sql not found: $sql" >&2
  exit 2
fi

db_name="${DEERFLOW_DB_NAME:-deepresvalue_v3}"

if command -v runuser >/dev/null 2>&1; then
  runuser -u postgres -- psql -d "$db_name" -v ON_ERROR_STOP=1 -f "$sql"
  exit 0
fi

if command -v sudo >/dev/null 2>&1; then
  sudo -u postgres psql -d "$db_name" -v ON_ERROR_STOP=1 -f "$sql"
  exit 0
fi

echo "ERROR: neither runuser nor sudo exists to run psql as postgres" >&2
exit 2
