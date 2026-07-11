# queue.py – Pydantic models for queue tokens
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# QueueCreate – schema for creating a queue token
class QueueCreate(BaseModel):
    department_id: str
    purpose: str = ""  # Optional purpose/query for the visit
    # Optional scheduled datetime for the token (ISO 8601 string)
    scheduled_at: Optional[str] = None

# QueueResponse – schema for returning queue token data
class QueueResponse(BaseModel):
    id: Optional[str] = None
    token_number: str
    department_id: str
    student_id: str
    status: str
    created_at: datetime
    # Optional scheduled datetime (ISO 8601 string) when the appointment is set
    scheduled_at: Optional[str] = None