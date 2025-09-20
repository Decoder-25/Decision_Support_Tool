# backend/routers/scenarios.py

from fastapi import APIRouter, HTTPException, Body, Query # type: ignore
from pydantic import BaseModel # type: ignore
from typing import List, Optional
from bson import ObjectId # type: ignore
from backend.database import db
from backend.models.scenario import Scenario
from backend.models.optimise import OptimiseResponse
from backend.services.optimiser import optimise_scenario
from backend.services.pareto import generate_pareto_frontier
from backend.models.optimise import ParetoFrontierResponse
from backend.models.optimise import ParetoPoint



import logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"]
)

def doc_to_scenario(doc) -> Scenario:
    doc = dict(doc)
    doc.pop('_id', None)
    return Scenario(**doc)

# Create a scenario
@router.post("/", response_model=dict)
def create_scenario(scenario: Scenario):
    doc = scenario.dict()
    result = db.scenarios.insert_one(doc)
    return {
      "message": "Scenario created successfully.",
      "id": str(result.inserted_id)
    }

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


# Pareto frontier (playground, no DB) 
class PlaygroundParetoRequest(BaseModel):
    scenario: Scenario
    max_budget: float
    max_indirect_budget: float = 0.0
    points: int = 25    

@router.post(
    "/pareto",
    response_model=ParetoFrontierResponse,
    summary="Generate Pareto frontier on‑the‑fly (no DB write)"
)
def pareto_playground(body: PlaygroundParetoRequest):
    raw_frontier = generate_pareto_frontier(
        body.scenario.dict(),
        body.max_budget,
        body.max_indirect_budget,
        body.points,
    )

    # map raw solutions into ParetoPoint shape
    points: List[ParetoPoint] = []
    for sol in raw_frontier:
        points.append(ParetoPoint(
            cost=sol["total_cost"],
            indirect_cost=sol["total_indirect_cost"],
            risk=sol["max_flow_to_targets"],
            selected_controls=sol["selected_controls"],
        ))

    return ParetoFrontierResponse(status="ok", frontier=points)


#Playground optimisation (no DB write)
class PlaygroundOptimiseRequest(BaseModel):
    scenario: Scenario
    budget: float
    indirect_budget: float
    targets: Optional[List[int]] = None

@router.post(
    "/optimise",
    response_model=OptimiseResponse,
    summary="Optimise on‑the‑fly (no DB save)"
)
def optimise_playground(req: PlaygroundOptimiseRequest):
    logger.info("Api hit")
    
    scen = req.scenario.dict()
    if req.targets is not None:
        scen["targets"] = req.targets
    return optimise_scenario(scen, req.budget, req.indirect_budget)


# Optimise a saved scenario (DB read, optional target override) 
class OptimiseRequest(BaseModel):
    budget: float
    indirect_budget: float
    targets: Optional[List[int]] = None

@router.post(
    "/{id}/optimise",
    response_model=OptimiseResponse,
    summary="Optimise a saved scenario"
)
def optimise_saved(id: str, body: OptimiseRequest = Body(...)):
    doc = db.scenarios.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(404, "Scenario not found")
    if body.targets is not None:
        doc["targets"] = body.targets
    return optimise_scenario(doc, body.budget, body.indirect_budget)