from bson import ObjectId
from app.database.database import db
from datetime import datetime
from app.core.constants import (
    QUEUE_WAITING,
    QUEUE_CALLED,
    QUEUE_COMPLETED,
    QUEUE_SKIPPED,
    ROLE_STUDENT,
)
from app.core.websocket_manager import manager


async def get_waiting_queue(department_id: str):

    queue = []

    cursor = db.tokens.find(
        {
            "department_id": department_id,
            "status": "waiting"
        }
    ).sort("created_at", 1)

    async for item in cursor:
        item["_id"] = str(item["_id"])
        queue.append(item)

    return queue

async def call_next_student(department_id: str):

    token = await db.tokens.find_one(
        {
            "department_id": department_id,
            "status": "waiting"
        },
        sort=[("created_at", 1)]
    )

    if token is None:
        return None

    await db.tokens.update_one(
        {"_id": token["_id"]},
        {
            "$set": {
                "status": QUEUE_CALLED
            }
        }
    )
    
    await manager.broadcast(
    {
        "type": "queue_update",
        "action": "called",
        "department_id": department_id,
        "token": token["token_number"],
        "status": "called",
    })

    token["status"] = QUEUE_CALLED
    token["_id"] = str(token["_id"])

    return token

async def update_token_status(token_id: str, status: str):

    token = await db.tokens.find_one(
        {"_id": ObjectId(token_id)}
    )

    if token is None:
        return None

    update_data = {
        "status": status
    }
    
    if status == QUEUE_COMPLETED:
        update_data["completed_at"] = datetime.utcnow()

    await db.tokens.update_one(
        {"_id": ObjectId(token_id)},
        {
            "$set": update_data
        }
    )
    
    await manager.broadcast(
    {
        "type": "queue_update",
        "action": status,
        "department_id": token["department_id"],
        "token": token["token_number"],
        "status": status,
    }
    )
    token.update(update_data)
    token["_id"] = str(token["_id"])

    return token

async def get_queue_history():

    history = []

    cursor = db.tokens.find().sort(
        "created_at",
        -1
    )

    async for token in cursor:
        token["_id"] = str(token["_id"])
        history.append(token)

    return history

async def dashboard_statistics():

    waiting = await db.tokens.count_documents(
        {"status": QUEUE_WAITING}
    )

    called = await db.tokens.count_documents(
        {"status": QUEUE_CALLED}
    )

    completed = await db.tokens.count_documents(
        {"status": QUEUE_COMPLETED}
    )

    skipped = await db.tokens.count_documents(
        {"status": QUEUE_SKIPPED}
    )

    departments = await db.departments.count_documents({})

    students = await db.users.count_documents(
        {"role": ROLE_STUDENT}
    )

    return {
        "waiting": waiting,
        "called": called,
        "completed": completed,
        "skipped": skipped,
        "departments": departments,
        "students": students
    }