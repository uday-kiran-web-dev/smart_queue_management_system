from fastapi import APIRouter, Depends, HTTPException

from app.core.constants import QUEUE_COMPLETED, QUEUE_SKIPPED, ROLE_ADMIN
from app.core.dependencies import get_current_user
from app.services.admin_service import (
    get_waiting_queue,
    call_next_student,
    update_token_status,
    get_queue_history,
    dashboard_statistics
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

def require_admin(current_user):

    if current_user["role"] != ROLE_ADMIN:
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


@router.put("/complete/{token_id}")
async def complete_service(
    token_id: str,
    current_user=Depends(get_current_user)
):

    require_admin(current_user)

    token = await update_token_status(
        token_id,
        QUEUE_COMPLETED
    )

    if token is None:
        raise HTTPException(
            status_code=404,
            detail="Token not found"
        )

    return {
        "message": "Service completed",
        "token": token
    }


@router.put("/skip/{token_id}")
async def skip_student(
    token_id: str,
    current_user=Depends(get_current_user)
):

    require_admin(current_user)

    token = await update_token_status(
        token_id,
        QUEUE_SKIPPED
    )

    if token is None:
        raise HTTPException(
            status_code=404,
            detail="Token not found"
        )

    return {
        "message": "Student skipped",
        "token": token
    }
    
@router.get("/history")
async def queue_history(
    current_user=Depends(get_current_user)
):

    require_admin(current_user)

    return await get_queue_history()


@router.get("/dashboard")
async def dashboard(
    current_user=Depends(get_current_user)
):

    require_admin(current_user)

    return await dashboard_statistics()