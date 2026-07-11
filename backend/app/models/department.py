# department.py – Pydantic models for department data
from pydantic import BaseModel
from typing import Optional


# DepartmentCreate – schema for creating a department
class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None


# DepartmentResponse – schema for returning department info
class DepartmentResponse(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None