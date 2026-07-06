from fastapi import APIRouter, HTTPException

from app.models.user import UserRegister
from app.services.auth_service import register_user

from app.models.user import UserLogin
from app.services.auth_service import login_user
from app.core.securtiy import create_access_token

from app.core.dependencies import get_current_user
from fastapi import Depends

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

#Register route
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
@router.post("/login")
async def login(user: UserLogin):

    existing_user = await login_user(user)

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": existing_user["email"],
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
@router.get("/me")
async def get_profile(
    current_user=Depends(get_current_user)
):

    return {
        "message": "Authenticated",
        "user": current_user
    }