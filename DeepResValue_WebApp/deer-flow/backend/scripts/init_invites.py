import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.auth.models import SystemInvite, Base

DB_URL = f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'deerflow.db'))}"
engine = create_engine(DB_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_system_invite(code: str):
    db = SessionLocal()
    try:
        if db.query(SystemInvite).filter(SystemInvite.code == code).first():
            print(f"Code {code} already exists.")
            return
        invite = SystemInvite(code=code)
        db.add(invite)
        db.commit()
        print(f"Successfully created system invite code: {code}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        create_system_invite(sys.argv[1])
    else:
        create_system_invite("DEEP2026")
        create_system_invite("ADMINVIP")
