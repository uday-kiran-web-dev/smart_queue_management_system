from datetime import datetime

from bson import ObjectId
from app.database import db


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

async def create_queue(queue):

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

        "student_id": queue.student_id,

        "status": "waiting",

        "created_at": datetime.utcnow()

    }

    result = await db.tokens.insert_one(queue_data)

    queue_data["_id"] = str(result.inserted_id)

    return queue_data