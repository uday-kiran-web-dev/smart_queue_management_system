from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_current_user

from app.services.admin_service import (
    get_waiting_queue,
    call_next_student
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

def require_admin(current_user):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

@router.get("/queue/{department_id}")
async def waiting_queue(
    department_id: str,
    current_user=Depends(get_current_user)
):

    require_admin(current_user)

    return await get_waiting_queue(
        department_id
    )

@router.post("/call-next/{department_id}")
async def call_next(
    department_id: str,
    current_user=Depends(get_current_user)
):

    require_admin(current_user)

    token = await call_next_student(
        department_id
    )

    if token is None:
        raise HTTPException(
            status_code=404,
            detail="No students waiting"
        )

    return token