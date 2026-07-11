# queue.py – Queue API routes
from fastapi import APIRouter, HTTPException

from app.models.queue import QueueCreate
from app.services.queue_service import create_queue, get_my_token, get_queue_position, cancel_token
from fastapi import Depends
from app.core.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/queue",
    tags=["Queue"]
)


# generate_token – generate a new queue token
@router.post("/generate-token")
async def generate_token(
    queue: QueueCreate,
    current_user=Depends(get_current_user)
):
    try:
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
    except Exception as e:
        logger.error(f"[Queue] Error generating token: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error generating token: {str(e)}"
        )
    

# my_token – retrieve current user's token
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

# my_position – get current user's queue position
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

# cancel_my_token – cancel current user's token
@router.put("/cancel-token/{token_id}")
async def cancel_my_token(
    token_id: str,
    current_user=Depends(get_current_user)
):
    try:
        cancelled = await cancel_token(token_id, current_user["user_id"])
        if cancelled is None:
            raise HTTPException(
                status_code=400,
                detail="Unable to cancel spot in line. It may not exist, belong to you, or is no longer waiting."
            )
        return {
            "message": "Spot cancelled successfully",
            "token": cancelled
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[Queue] Error cancelling token: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error cancelling spot: {str(e)}"
        )
