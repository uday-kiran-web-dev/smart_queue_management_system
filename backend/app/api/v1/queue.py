from fastapi import APIRouter, HTTPException

from app.models.queue import QueueCreate
from app.services.queue_service import create_queue, get_my_token, get_queue_position
from fastapi import Depends
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/queue",
    tags=["Queue"]
)


@router.post("/generate-token")
async def generate_token(
    queue: QueueCreate,
    current_user=Depends(get_current_user)
):

    created = await create_queue(queue, current_user["user_id"])

    if created is None:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    return {
        "message": "Token generated successfully",
        "token": created
    }
    

@router.get("/my-token")
async def my_token(
    current_user=Depends(get_current_user)
):

    token = await get_my_token(
        current_user["user_id"]
    )

    if token is None:
        raise HTTPException(
            status_code=404,
            detail="No active token"
        )

    return token

@router.get("/my-position")
async def my_position(
    current_user=Depends(get_current_user)
):

    position = await get_queue_position(
        current_user["user_id"]
    )

    if position is None:
        raise HTTPException(
            status_code=404,
            detail="No active queue"
        )

    return position