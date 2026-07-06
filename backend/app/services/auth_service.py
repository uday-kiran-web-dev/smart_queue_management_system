from app.database import db
from app.core.securtiy import hash_password


async def register_user(user):

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if existing_user:
        return None

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": "student"
    }

    result = await db.users.insert_one(new_user)

    new_user["_id"] = str(result.inserted_id)

    return new_user