from bson import ObjectId
from app.database import db


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
                "status": "called"
            }
        }
    )

    token["status"] = "called"
    token["_id"] = str(token["_id"])

    return token