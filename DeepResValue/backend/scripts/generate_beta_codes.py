import sys
import os
import argparse
import uuid
import logging

# Add the parent directory to sys.path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models import BetaInviteCode

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def init_db():
    Base.metadata.create_all(bind=engine)

def generate_codes(count: int, prefix: str = "BETA"):
    db = SessionLocal()
    try:
        codes = []
        for _ in range(count):
            random_str = str(uuid.uuid4())[:6].upper()
            code = f"{prefix}-{random_str}"
            new_code = BetaInviteCode(code=code)
            db.add(new_code)
            codes.append(code)
            
        db.commit()
        logging.info(f"Successfully generated {count} beta invite codes:")
        for c in codes:
            logging.info(f"  - {c}")
    except Exception as e:
        db.rollback()
        logging.error(f"Failed to generate codes: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Beta Invite Codes")
    parser.add_argument("--count", type=int, default=10, help="Number of codes to generate")
    parser.add_argument("--prefix", type=str, default="BETA", help="Prefix for the generated codes")
    
    args = parser.parse_args()
    
    init_db()
    generate_codes(args.count, args.prefix)
