# department.py – Department API routes
from fastapi import APIRouter, HTTPException

from app.models.department import DepartmentCreate
from app.services.department_service import (
    create_department,
    get_departments
)

router = APIRouter(
    prefix="/departments",
    tags=["Departments"]
)


# add_department – create a new department
@router.post("")
async def add_department(
    department: DepartmentCreate
):

    created = await create_department(department)

    if created is None:
        raise HTTPException(
            status_code=400,
            detail="Department already exists"
        )

    return {
        "message": "Department created successfully",
        "department": created
    }


# list_departments – list all departments
@router.get("")
async def list_departments():

    return await get_departments()