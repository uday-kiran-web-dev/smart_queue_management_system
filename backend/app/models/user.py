from pydantic import BaseModel, Field, EmailStr

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(..., regex=r'^\S+@\S+\.\S+$')
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr = Field(..., regex=r'^\S+@\S+\.\S+$')
    password: str = Field(..., min_length=6, max_length=100)