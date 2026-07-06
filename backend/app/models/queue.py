from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QueueCreate(BaseModel):
    department_id: str

class QueueResponse(BaseModel):
    id: Optional[str] = None
    token_number: str
    department_id: str
    student_id: str
    status: str
    created_at: datetime