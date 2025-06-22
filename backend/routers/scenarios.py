# backend/routers/scenarios.py

from fastapi import APIRouter, HTTPException, Body, Query
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
from backend.database import db
from backend.models.scenario import Scenario
from backend.services.optimiser import optimise_scenario

router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"]
)

# Helper: Convert MongoDB document to Pydantic model
def doc_to_scenario(doc) -> Scenario:
    # Remove MongoDB's _id (or convert to string if you want to keep)
    doc = dict(doc)
    doc.pop('_id', None)
    return Scenario(**doc)

# Create a scenario
@router.post("/", response_model=dict)
def create_scenario(scenario: Scenario):
    doc = scenario.dict()
    db.scenarios.insert_one(doc)
    return {"message": "Scenario created successfully."}

# List all scenarios (names & ids)
@router.get("/", response_model=List[dict])
def list_scenarios():
    results = db.scenarios.find()
    scenarios = []
    for doc in results:
        scenarios.append({
            "id": str(doc.get("_id")),
            "name": doc.get("name", "")
        })
    return scenarios

# Get a scenario by ID
@router.get("/{id}", response_model=Scenario)
def get_scenario(id: str):
    doc = db.scenarios.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(404, detail="Scenario not found")
    return doc_to_scenario(doc)

# Update a scenario
@router.put("/{id}", response_model=dict)
def update_scenario(id: str, scenario: Scenario):
    result = db.scenarios.update_one(
        {"_id": ObjectId(id)},
        {"$set": scenario.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(404, detail="Scenario not found")
    return {"message": "Scenario updated successfully."}

# Delete a scenario
@router.delete("/{id}", response_model=dict)
def delete_scenario(id: str):
    result = db.scenarios.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, detail="Scenario not found")
    return {"message": "Scenario deleted successfully."}

# Optimise a scenario for given budgets
class OptimiseRequest(BaseModel):
    budget: float
    indirect_budget: float

@router.post("/{id}/optimise", response_model=dict)
def optimise(id: str, body: OptimiseRequest = Body(...)):
    doc = db.scenarios.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(404, detail="Scenario not found")
    result = optimise_scenario(doc, body.budget, body.indirect_budget)
    return result
