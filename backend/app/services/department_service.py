from app.database.database import db


async def create_department(department):

    existing = await db.departments.find_one(
        {"name": department.name}
    )

    if existing:
        return None

    new_department = {
        "name": department.name,
        "description": department.description
    }

    result = await db.departments.insert_one(new_department)

    new_department["_id"] = str(result.inserted_id)

    return new_department


async def get_departments():

    departments = []

    async for department in db.departments.find():

        department["_id"] = str(department["_id"])

        departments.append(department)

    return departments