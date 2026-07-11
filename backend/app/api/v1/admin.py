# Admin API routes
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.constants import QUEUE_COMPLETED, QUEUE_SKIPPED, QUEUE_CANCELLED, ROLE_ADMIN
from app.core.dependencies import get_current_user
from app.services.admin_service import (
    get_waiting_queue,
    update_token_status,
    get_queue_history,
    dashboard_statistics
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

class ActionPayload(BaseModel):
    feedback: str | None = None

# Ensure user has admin role
def require_admin(current_user):
    if current_user["role"] != ROLE_ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

# Get waiting queue
@router.get("/queue")
async def all_queue_tokens(current_user=Depends(get_current_user)):
    require_admin(current_user)
    return await get_waiting_queue()

@router.get("/queue/{department_id}")
async def waiting_queue(department_id: str, current_user=Depends(get_current_user)):
    require_admin(current_user)
    return await get_waiting_queue(department_id)



# Call specific student token
@router.put("/call/{token_id}")
async def call_student_by_id(token_id: str, current_user=Depends(get_current_user)):
    require_admin(current_user)
    token = await update_token_status(token_id, "called")
    if token is None:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"message": "Student called", "token": token}

# Mark token as completed
@router.put("/complete/{token_id}")
async def complete_service(token_id: str, payload: ActionPayload = None, current_user=Depends(get_current_user)):
    require_admin(current_user)
    feedback = payload.feedback if payload else None
    token = await update_token_status(token_id, QUEUE_COMPLETED, feedback)
    if token is None:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"message": "Service completed", "token": token}

# Skip student token
@router.put("/skip/{token_id}")
async def skip_student(token_id: str, payload: ActionPayload = None, current_user=Depends(get_current_user)):
    require_admin(current_user)
    feedback = payload.feedback if payload else None
    token = await update_token_status(token_id, QUEUE_SKIPPED, feedback)
    if token is None:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"message": "Student skipped", "token": token}

# Cancel student token
@router.put("/cancel/{token_id}")
async def cancel_student(token_id: str, payload: ActionPayload = None, current_user=Depends(get_current_user)):
    require_admin(current_user)
    feedback = payload.feedback if payload else None
    token = await update_token_status(token_id, QUEUE_CANCELLED, feedback)
    if token is None:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"message": "Student cancelled", "token": token}

# Retrieve queue history
@router.get("/history")
async def queue_history(current_user=Depends(get_current_user)):
    require_admin(current_user)
    return await get_queue_history()

# Admin dashboard statistics
@router.get("/dashboard")
async def dashboard(current_user=Depends(get_current_user)):
    require_admin(current_user)
    return await dashboard_statistics()
