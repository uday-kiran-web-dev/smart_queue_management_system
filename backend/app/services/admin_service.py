# Business logic for admin operations and queue management
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


# Retrieve waiting queue for a department, enriched with student details
async def get_waiting_queue(department_id: str = None):
    queue = []
    query = {}

    if department_id:
        query["department_id"] = department_id

    cursor = db.tokens.find(query).sort("created_at", 1)

    async for item in cursor:
        item["_id"] = str(item["_id"])
        student_id = item.get("student_id")
        if student_id:
            try:
                oid = ObjectId(student_id)
                user = await db.users.find_one({"_id": oid})
            except Exception:
                user = await db.users.find_one({"_id": student_id})
            if user:
                item["student_name"] = user.get("name")
                item["student_email"] = user.get("email")
        queue.append(item)

    return queue



# Update token status and broadcast change
async def update_token_status(token_id: str, status: str, feedback: str = None):
    token = await db.tokens.find_one(
        {"_id": ObjectId(token_id)}
    )

    if token is None:
        return None

    update_data = {
        "status": status
    }
    
    if feedback is not None:
        update_data["admin_feedback"] = feedback
    
    if status == QUEUE_COMPLETED:
        update_data["completed_at"] = datetime.utcnow().isoformat()

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

# Retrieve full queue history
async def get_queue_history():
    history = []

    cursor = db.tokens.find().sort(
        "created_at",
        -1
    )

    async for token in cursor:
        token["_id"] = str(token["_id"])
        
        # Enrich token with student details if available
        student_id = token.get("student_id")
        if student_id:
            try:
                oid = ObjectId(student_id)
                user = await db.users.find_one({"_id": oid})
            except Exception:
                user = await db.users.find_one({"_id": student_id})
            if user:
                token["student_name"] = user.get("name")
                token["student_email"] = user.get("email")
                
        history.append(token)

    return history

# Compute statistics for admin dashboard
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
