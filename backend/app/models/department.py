from pydantic import BaseModel
from typing import Optional


class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None


class DepartmentResponse(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None