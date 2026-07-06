from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.department import router as department_router

app = FastAPI(
    title="Queue Management API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(department_router)

@app.get("/")
async def root():
    return {
        "message": "Smart Queue Management API Running"
    }

