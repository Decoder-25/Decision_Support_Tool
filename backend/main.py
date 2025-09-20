# backend/main.py

from fastapi import FastAPI
from backend.routers import scenarios
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Decision Support Backend",
    description="API for Cybersecurity Investment Optimisation and Scenario Management",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
   allow_origins=["*"],            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
)

app.include_router(scenarios.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to your Decision support tool's backend!"}
