import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
from sqlalchemy import create_engine, text

# We use the saas.db for local dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///saas.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

with engine.connect() as conn:
    # Check if invite_code column exists
    try:
        conn.execute(text("SELECT invite_code FROM users LIMIT 1"))
        print("Column invite_code already exists.")
    except Exception as e:
        print("Adding invite_code and invited_by_id to users...")
        if DATABASE_URL.startswith("sqlite"):
            conn.execute(text("ALTER TABLE users ADD COLUMN invite_code VARCHAR"))
            conn.execute(text("ALTER TABLE users ADD COLUMN invited_by_id INTEGER"))
        else:
            conn.execute(text("ALTER TABLE users ADD COLUMN invite_code VARCHAR UNIQUE"))
            conn.execute(text("ALTER TABLE users ADD COLUMN invited_by_id INTEGER REFERENCES users(id)"))
        conn.commit()

from app.models import Base
Base.metadata.create_all(bind=engine)
print("Database schema updated successfully.")
