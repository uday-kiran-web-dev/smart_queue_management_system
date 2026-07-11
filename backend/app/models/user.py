# user.py – Pydantic models for user data
from pydantic import BaseModel, EmailStr
from typing import Optional


# UserRegister – schema for user registration
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

# UserLogin – schema for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# UserUpdate – schema for updating user profile
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    current_password: Optional[str] = None

# UserResponse – schema for returning user info
class UserResponse(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    role: str