from bson import ObjectId
from app.database import db
from datetime import datetime


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

async def update_token_status(token_id: str, status: str):

    token = await db.tokens.find_one(
        {"_id": ObjectId(token_id)}
    )

    if token is None:
        return None

    update_data = {
        "status": status
    }
    
    if status == "completed":
        update_data["completed_at"] = datetime.utcnow()

    await db.tokens.update_one(
        {"_id": ObjectId(token_id)},
        {
            "$set": update_data
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
        {"status": "waiting"}
    )

    called = await db.tokens.count_documents(
        {"status": "called"}
    )

    completed = await db.tokens.count_documents(
        {"status": "completed"}
    )

    skipped = await db.tokens.count_documents(
        {"status": "skipped"}
    )

    departments = await db.departments.count_documents({})

    students = await db.users.count_documents(
        {"role": "student"}
    )

    return {
        "waiting": waiting,
        "called": called,
        "completed": completed,
        "skipped": skipped,
        "departments": departments,
        "students": students
    }