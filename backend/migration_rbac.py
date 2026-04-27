import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "deerflow.db")
db = sqlite3.connect(db_path)
cursor = db.cursor()
try:
    cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user'")
    cursor.execute("ALTER TABLE users ADD COLUMN tier VARCHAR DEFAULT 'free'")
    db.commit()
    print("Migration successful: added role and tier to users table.")
except Exception as e:
    print("Migration error:", e)
db.close()