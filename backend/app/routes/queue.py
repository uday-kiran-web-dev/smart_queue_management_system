from fastapi import APIRouter, HTTPException

from app.models.queue import QueueCreate
from app.services.queue_service import create_queue

router = APIRouter(
    prefix="/queue",
    tags=["Queue"]
)


@router.post("/generate-token")
async def generate_token(
    queue: QueueCreate
):

    created = await create_queue(queue)

    if created is None:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    return {
        "message": "Token generated successfully",
        "token": created
    }