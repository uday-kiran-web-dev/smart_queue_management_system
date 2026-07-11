# queue_service.py – Business logic for queue token operations
from datetime import datetime

from bson import ObjectId
from app.database.database import db
from app.core.constants import QUEUE_WAITING
from app.core.websocket_manager import manager


# generate_token_number – create a unique token string for a department
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

# create_queue – create a new queue token for a student
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

        "purpose": queue.purpose or "",
        # Include scheduled time if provided by the client
        "scheduled_at": getattr(queue, "scheduled_at", None),
        "created_at": datetime.utcnow().isoformat()

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


# get_my_token – retrieve waiting tokens for a student
async def get_my_token(student_id: str):

    tokens = []
    cursor = db.tokens.find(
        {
            "student_id": student_id
        }
    ).sort("created_at", 1)

    async for token in cursor:
        token["_id"] = str(token["_id"])
        tokens.append(token)

    return tokens

# get_queue_position – get a student's position in the queue
async def get_queue_position(student_id: str, department_id: str = None):

    token = await db.tokens.find_one(
        {
            "student_id": student_id,
            "status": "waiting"
        }
    )

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

# cancel_token – cancel a student's own waiting token
async def cancel_token(token_id: str, student_id: str):
    token = await db.tokens.find_one({"_id": ObjectId(token_id), "student_id": student_id})
    if not token:
        return None
    if token["status"] != "waiting":
        return None

    await db.tokens.update_one(
        {"_id": ObjectId(token_id)},
        {"$set": {"status": "cancelled"}}
    )
    
    token["status"] = "cancelled"
    token["_id"] = str(token["_id"])
    
    await manager.broadcast({
         "type": "queue_update",
         "action": "token_cancelled",
         "department_id": token["department_id"],
         "token": token["token_number"],
         "status": "cancelled",
    })
    
    return token
