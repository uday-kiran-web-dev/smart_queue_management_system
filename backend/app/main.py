# main.py – FastAPI application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.v1.auth import router as auth_router
from app.api.v1.department import router as department_router
from app.api.v1.queue import router as queue_router
from app.api.v1.admin import router as admin_router
from app.api.v1.websocket import router as websocket_router
from app.core.config import ALLOWED_ORIGINS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Queue Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(department_router, prefix="/api/v1")
app.include_router(queue_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(websocket_router,prefix="/api/v1")

@app.get("/")
# root – health check endpoint
async def root():
    return {
        "message": "Smart Queue Management API Running"
    }

