# dependencies.py – Dependency utilities for FastAPI
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import verify_access_token
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer()


# get_current_user – retrieve and verify current user from JWT
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials
    logger.info(f"[Auth] Verifying token: {token[:20]}...")

    payload = verify_access_token(token)

    if payload is None:
        logger.error(f"[Auth] Token verification failed for token: {token[:20]}...")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    logger.info(f"[Auth] Token verified for user: {payload.get('user_id')}")
    return payload