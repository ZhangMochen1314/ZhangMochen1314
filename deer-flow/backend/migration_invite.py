import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "deerflow.db")
db = sqlite3.connect(db_path)
cursor = db.cursor()
try:
    cursor.execute("ALTER TABLE users ADD COLUMN my_invite_code VARCHAR")
    cursor.execute("ALTER TABLE users ADD COLUMN invited_by VARCHAR")
    db.commit()
    print("Migration successful: added my_invite_code and invited_by to users table.")
except Exception as e:
    print("Migration error:", e)

# Make sure there is an initial code DEEP2026. We can just insert a dummy user or update id=1
try:
    # check if user 1 exists
    cursor.execute("SELECT id FROM users WHERE id = 1")
    if cursor.fetchone():
        cursor.execute("UPDATE users SET my_invite_code = 'DEEP2026' WHERE id = 1")
    else:
        # Create a dummy admin with the code
        cursor.execute("INSERT INTO users (username, email, hashed_password, role, my_invite_code) VALUES ('admin', 'admin@example.com', 'dummy', 'admin', 'DEEP2026')")
    db.commit()
    print("Set default invite code DEEP2026.")
except Exception as e:
    print("Error setting default code:", e)

db.close()
