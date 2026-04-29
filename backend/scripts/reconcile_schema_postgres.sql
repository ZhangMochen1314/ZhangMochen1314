ALTER TABLE users
ADD COLUMN IF NOT EXISTS hashed_password VARCHAR,
ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'user',
ADD COLUMN IF NOT EXISTS tier VARCHAR DEFAULT 'free';

UPDATE users
SET hashed_password = COALESCE(hashed_password, password_hash)
WHERE password_hash IS NOT NULL;

ALTER TABLE users
ALTER COLUMN hashed_password SET NOT NULL;

ALTER TABLE users
ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE session_states
ALTER COLUMN id TYPE VARCHAR USING id::varchar;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE users DROP COLUMN tenant_id;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'session_states' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE session_states DROP COLUMN tenant_id;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'files'
    ) AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'files' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE files DROP COLUMN tenant_id;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'analysis_tasks'
    ) AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'analysis_tasks' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE analysis_tasks DROP COLUMN tenant_id;
    END IF;
END $$;
