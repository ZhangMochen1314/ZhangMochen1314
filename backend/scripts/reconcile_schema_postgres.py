from __future__ import annotations

import os
from urllib.parse import urlparse

import psycopg2


def _normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql+asyncpg://"):
        return "postgresql://" + database_url[len("postgresql+asyncpg://") :]
    if database_url.startswith("postgres://"):
        return "postgresql://" + database_url[len("postgres://") :]
    return database_url


def _ensure_postgres_url(database_url: str) -> str:
    normalized = _normalize_database_url(database_url)
    parsed = urlparse(normalized)
    if parsed.scheme not in {"postgresql", "postgres"}:
        raise ValueError("reconcile_schema_postgres.py requires a PostgreSQL DATABASE_URL")
    return normalized


def migrate() -> None:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL is required")

    connection_url = _ensure_postgres_url(database_url)
    print(f"Connecting to PostgreSQL at {urlparse(connection_url).hostname}")

    with psycopg2.connect(connection_url) as conn:
        conn.autocommit = False
        with conn.cursor() as cursor:
            # users: keep hashed_password as the canonical column and relax legacy password_hash.
            cursor.execute(
                """
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS hashed_password VARCHAR,
                ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'user',
                ADD COLUMN IF NOT EXISTS tier VARCHAR DEFAULT 'free'
                """
            )
            cursor.execute(
                """
                UPDATE users
                SET hashed_password = COALESCE(hashed_password, password_hash)
                WHERE password_hash IS NOT NULL
                """
            )
            cursor.execute("ALTER TABLE users ALTER COLUMN hashed_password SET NOT NULL")
            cursor.execute("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL")

            # session_states: align id shape with code (sess_xxx) and remove tenant dependency.
            cursor.execute(
                """
                ALTER TABLE session_states
                ALTER COLUMN id TYPE VARCHAR USING id::varchar
                """
            )

            # Drop legacy tenant_id columns now that the app is user-scoped.
            for table_name in ("users", "session_states", "files", "analysis_tasks"):
                cursor.execute(
                    f"ALTER TABLE {table_name} DROP COLUMN IF EXISTS tenant_id"
                )

        conn.commit()
        print("PostgreSQL schema reconciliation complete.")


if __name__ == "__main__":
    migrate()
