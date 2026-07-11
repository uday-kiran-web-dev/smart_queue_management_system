# websocket.py – WebSocket endpoint routes
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
import logging

from app.core.websocket_manager import manager

router = APIRouter()
logger = logging.getLogger(__name__)


# websocket_endpoint – handle WebSocket connections
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await manager.connect(websocket)
        logger.info(f"WebSocket client connected. Total connections: {len(manager.active_connections)}")

        try:
            while True:
                # Keep connection alive by receiving messages
                data = await websocket.receive_text()
                logger.debug(f"WebSocket received: {data}")

        except WebSocketDisconnect:
            manager.disconnect(websocket)
            logger.info(f"WebSocket client disconnected. Total connections: {len(manager.active_connections)}")
        except Exception as e:
            logger.error(f"WebSocket error: {str(e)}")
            manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket connection error: {str(e)}")
        await websocket.close(code=status.WS_1011_SERVER_ERROR)