from fastapi import FastAPI

app = FastAPI(
    title="SQMS API",
    description="A simple API for managing the SQMS system",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "SQMS API is running!"}