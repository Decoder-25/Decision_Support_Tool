# backend/main.py

from fastapi import FastAPI
from backend.routers import scenarios
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CySecTool Decision Support Backend",
    description="API for Cybersecurity Investment Optimisation and Scenario Management",
    version="1.0.0"
)
origins = [
    "http://localhost:5173",  # your Vite/React dev server
    "http://localhost:3000",  # if you ever run at 3000
    # add production URLs here once deployed
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # <-- you must list the React origin(s)
    allow_credentials=True,
    allow_methods=["*"],              # GET, POST, PUT, DELETE, etc
    allow_headers=["*"],              # Authorization, Content‑Type, etc
)

# Include the scenarios router
app.include_router(scenarios.router)

# Health check route (optional)
@app.get("/")
def read_root():
    return {"message": "Welcome to your CySecTool-inspired backend!"}
