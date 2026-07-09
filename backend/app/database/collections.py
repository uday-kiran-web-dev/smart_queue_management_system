# -------------------------------------------------
# collections.py – MongoDB collection references
# -------------------------------------------------

# Import the database instance
from .database import db

# Define collection handles (adjust names as per your schema)
users_collection = db.get_collection("users")
departments_collection = db.get_collection("departments")
queues_collection = db.get_collection("queues")
