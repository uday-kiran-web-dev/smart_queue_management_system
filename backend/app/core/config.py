# config.py – Application configuration loader
from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Load allowed origins as a comma-separated string, default to local dev URLs
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000,http://127.0.0.1:8000")
ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

# Validate required config
if not SECRET_KEY:
    logger.error("[Config] SECRET_KEY is not set in environment variables!")
    SECRET_KEY = "dev-secret-key-change-in-production"  # Fallback for development
    logger.warning("[Config] Using default SECRET_KEY - tokens may not be portable across restarts")

if not MONGO_URI:
    logger.error("[Config] MONGO_URI is not set in environment variables!")

logger.info(f"[Config] Loaded - Algorithm: {ALGORITHM}, Token Expiry: {ACCESS_TOKEN_EXPIRE_MINUTES} min")