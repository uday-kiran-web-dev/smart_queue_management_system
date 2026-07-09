# -------------------------------------------------
# auth_service.py – Business logic for authentication and user management
# -------------------------------------------------
from app.database.database import db
from app.core.security import hash_password, verify_password
from app.core.constants import ROLE_STUDENT
from bson import ObjectId


# -------------------------------------------------
# register_user – create a new user account
# -------------------------------------------------
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
        "role": ROLE_STUDENT
    }

    result = await db.users.insert_one(new_user)

    new_user["_id"] = str(result.inserted_id)

    return new_user

# -------------------------------------------------
# login_user – authenticate a user and return user data
# -------------------------------------------------
async def login_user(user):

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if not existing_user:
        return None

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        return None

    return existing_user


# -------------------------------------------------
# update_user – update user profile information
# -------------------------------------------------
async def update_user(user_id: str, update_data: dict):
    
    user = await db.users.find_one(
        {"_id": ObjectId(user_id)}
    )

    if not user:
        return None

    # If changing password, verify current password
    if update_data.get("password"):
        current_password = update_data.pop("current_password", None)
        if not current_password or not verify_password(current_password, user["password"]):
            return {"error": "Invalid current password"}

        update_data["password"] = hash_password(update_data["password"])

    # Check if email is being changed and if it's already taken
    if update_data.get("email") and update_data["email"] != user["email"]:
        existing_user = await db.users.find_one(
            {"email": update_data["email"]}
        )
        if existing_user:
            return {"error": "Email already registered"}

    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}

    if not update_data:
        user["_id"] = str(user["_id"])
        return user

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        user["_id"] = str(user["_id"])
        return user

    # Fetch updated user
    updated_user = await db.users.find_one(
        {"_id": ObjectId(user_id)}
    )

    updated_user["_id"] = str(updated_user["_id"])
    return updated_user