from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.department import router as department_router
from app.routes.queue import router as queue_router
from app.routes.admin import router as admin_router

app = FastAPI(
    title="Queue Management API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(department_router)
app.include_router(queue_router)
app.include_router(admin_router)

@app.get("/")
async def root():
    return {
        "message": "Smart Queue Management API Running"
    }

