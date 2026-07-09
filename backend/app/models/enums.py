# -------------------------------------------------
# enums.py – Enum definitions for queue status and user roles
# -------------------------------------------------
from enum import Enum


# -------------------------------------------------
# QueueStatus – possible states of a queue token
# -------------------------------------------------
class QueueStatus(str, Enum):
    waiting = "waiting"
    called = "called"
    completed = "completed"
    skipped = "skipped"


# -------------------------------------------------
# UserRole – possible user roles in the system
# -------------------------------------------------
class UserRole(str, Enum):
    admin = "admin"
    student = "student"