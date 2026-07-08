from datetime import datetime

from bson import ObjectId
from app.database.database import db
from app.core.constants import QUEUE_WAITING
from app.core.websocket_manager import manager


async def generate_token_number(department_name: str):

    prefix = "".join(
        word[0].upper()
        for word in department_name.split()
    )

    total = await db.tokens.count_documents(
        {"department_name": department_name}
    )

    token = f"{prefix}-{total + 1:03d}"

    return token

async def create_queue(queue, student_id: str):

    department = await db.departments.find_one(
        {"_id": ObjectId(queue.department_id)}
    )

    if department is None:
        return None

    token = await generate_token_number(
        department["name"]
    )

    queue_data = {

        "token_number": token,

        "department_id": queue.department_id,

        "department_name": department["name"],

        "student_id": student_id,

        "status": "waiting",

        "created_at": datetime.utcnow()

    }

    result = await db.tokens.insert_one(queue_data)

    queue_data["_id"] = str(result.inserted_id)

    await manager.broadcast({
        "type": "token_generated",
        "data": queue_data
    })
    
    await manager.broadcast({
         "type": "queue_update",
        "action": "token_generated",
        "department_id": queue_data["department_id"],
        "token": queue_data["token_number"],
        "status": queue_data["status"],
    })

    return queue_data


async def get_my_token(student_id: str):

    token = await db.tokens.find_one(
        {
            "student_id": student_id,
            "status": "waiting"
        }
    )

    if token:
        token["_id"] = str(token["_id"])

    return token

async def get_queue_position(student_id: str):

    token = await db.tokens.find_one(
        {
            "student_id": student_id,
            "status": "waiting"
        }
    )

    if token is None:
        return None

    position = await db.tokens.count_documents(
        {
            "department_id": token["department_id"],
            "status": QUEUE_WAITING,
            "created_at": {
                "$lt": token["created_at"]
            }
        }
    )

    return {
        "token_number": token["token_number"],
        "position": position + 1
    }