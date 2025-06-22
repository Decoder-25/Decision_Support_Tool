# backend/main.py

from fastapi import FastAPI
from backend.routers import scenarios

app = FastAPI(
    title="CySecTool Decision Support Backend",
    description="API for Cybersecurity Investment Optimisation and Scenario Management",
    version="1.0.0"
)

# Include the scenarios router
app.include_router(scenarios.router)

# Health check route (optional)
@app.get("/")
def read_root():
    return {"message": "Welcome to your CySecTool-inspired backend!"}
