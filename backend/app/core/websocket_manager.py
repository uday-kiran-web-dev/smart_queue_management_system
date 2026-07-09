# -------------------------------------------------
# websocket_manager.py – WebSocket connection manager
# -------------------------------------------------
from fastapi import WebSocket
from typing import List

class ConnectionManager:

    # -------------------------------------------------
    # __init__ – initialize connection manager
    # -------------------------------------------------
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    # -------------------------------------------------
    # connect – accept a new WebSocket connection
    # -------------------------------------------------
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    # -------------------------------------------------
    # disconnect – remove a WebSocket connection
    # -------------------------------------------------
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    # -------------------------------------------------
    # broadcast – send a message to all active connections
    # -------------------------------------------------
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()