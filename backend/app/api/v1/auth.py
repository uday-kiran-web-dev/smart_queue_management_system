# auth.py – Authentication API routes
from fastapi import APIRouter, HTTPException

from app.models.user import UserRegister, UserUpdate
from app.services.auth_service import register_user, update_user

from app.models.user import UserLogin
from app.services.auth_service import login_user
from app.core.security import create_access_token

from app.core.dependencies import get_current_user
from fastapi import Depends
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

#Register route
# register – user registration endpoint
@router.post("/register")
async def register(user: UserRegister):

    created_user = await register_user(user)

    if not created_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return {
        "message": "User registered successfully",
        "user": {
            "id": created_user["_id"],
            "name": created_user["name"],
            "email": created_user["email"],
            "role": created_user["role"]
        }
    }

#Login route
# login – user login endpoint
@router.post("/login")
async def login(user: UserLogin):

    existing_user = await login_user(user)

    if not existing_user:
        logger.warning(f"[Auth] Login failed for email: {user.email}")
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    logger.info(f"[Auth] Login successful for user: {existing_user['_id']}")

    access_token = create_access_token(
        {
             "sub": existing_user["email"],
             "user_id": str(existing_user["_id"]),
             "role": existing_user["role"]
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(existing_user["_id"]),
            "name": existing_user["name"],
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    }

#Get profile route  
# get_profile – retrieve current user profile
@router.get("/me")
async def get_profile(
    current_user=Depends(get_current_user)
):

    return {
        "message": "Authenticated",
        "user": current_user
    }

#Update profile route
# update_profile – update current user profile
@router.put("/update-profile")
async def update_profile(
    update_data: UserUpdate,
    current_user=Depends(get_current_user)
):
    try:
        updated_user = await update_user(
            current_user["user_id"],
            update_data.dict(exclude_unset=True)
        )

        if isinstance(updated_user, dict) and "error" in updated_user:
            raise HTTPException(
                status_code=400,
                detail=updated_user["error"]
            )

        return {
            "message": "Profile updated successfully",
            "user": {
                "id": updated_user["_id"],
                "name": updated_user["name"],
                "email": updated_user["email"],
                "role": updated_user["role"]
            }
        }
    except Exception as e:
        logger.error(f"[Auth] Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error updating profile"
        )