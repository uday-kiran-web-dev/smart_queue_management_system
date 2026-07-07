from enum import Enum


class QueueStatus(str, Enum):
    waiting = "waiting"
    called = "called"
    completed = "completed"
    skipped = "skipped"


class UserRole(str, Enum):
    admin = "admin"
    student = "student"