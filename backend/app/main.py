from fastapi import FastAPI

from app.api.v1.auth import router as auth_router
from app.api.v1.department import router as department_router
from app.api.v1.queue import router as queue_router
from app.api.v1.admin import router as admin_router

app = FastAPI(
    title="Queue Management API",
    version="1.0.0"
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(department_router, prefix="/api/v1")
app.include_router(queue_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Smart Queue Management API Running"
    }

