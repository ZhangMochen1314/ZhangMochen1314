import sqlite3

def migrate():
    conn = sqlite3.connect('deerflow.db')
    cursor = conn.cursor()
    
    # Check if tenant_id exists in users
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'tenant_id' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN tenant_id VARCHAR(64) DEFAULT 'default_tenant'")
        cursor.execute("CREATE INDEX idx_users_tenant ON users(tenant_id)")
        print("Added tenant_id to users")

    # Check if tenant_id exists in session_states
    cursor.execute("PRAGMA table_info(session_states)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'tenant_id' not in columns:
        cursor.execute("ALTER TABLE session_states ADD COLUMN tenant_id VARCHAR(64) DEFAULT 'default_tenant'")
        print("Added tenant_id to session_states")

    # Files and AnalysisTasks tables will be created by SQLAlchemy create_all if they don't exist
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()