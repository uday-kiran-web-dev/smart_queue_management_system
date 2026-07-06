from fastapi import FastAPI

from app.routes.auth import router as auth_router

app = FastAPI(
    title="Queue Management API",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
async def root():
    return {
        "message": "Smart Queue Management API Running"
    }