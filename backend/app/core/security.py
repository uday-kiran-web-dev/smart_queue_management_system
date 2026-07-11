# security.py – Security utilities (password hashing, JWT)
from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext
import logging

from app.core.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    SECRET_KEY,
)

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# hash_password – hash a plain password using bcrypt
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# verify_password – verify a plain password against hashed version
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# create_access_token – generate JWT access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"[Token] Created token for user: {data.get('user_id')}, expires in {ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
    return encoded_jwt


# verify_access_token – validate JWT and return payload
def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(f"[Token] Successfully decoded token for user: {payload.get('user_id')}")
        return payload
    except JWTError as e:
        logger.error(f"[Token] JWT verification failed: {str(e)}")
        return None
