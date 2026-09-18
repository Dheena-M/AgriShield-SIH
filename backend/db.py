import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

ROOT = Path(__file__).resolve().parent.parent
# Vercel functions expose the deployed source as read-only.  Keep temporary
# runtime state in /tmp there while preserving the usual project-local paths
# during desktop development.
RUNTIME_ROOT = Path("/tmp") if os.environ.get("VERCEL") else ROOT
DB_PATH = RUNTIME_ROOT / "agrishield.db"
UPLOADS = RUNTIME_ROOT / "uploads"
UPLOADS.mkdir(exist_ok=True)

engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
