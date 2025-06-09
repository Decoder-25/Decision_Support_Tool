from fastapi import FastAPI
from models import OptimisationRequest
from optimiser import optimise_controls

app = FastAPI()

@app.post("/optimise")
def optimise(request: OptimisationRequest):
    # Convert Pydantic models to dicts for processing
    controls = [c.dict() for c in request.controls]
    result = optimise_controls(controls, request.budget, request.indirect_budget)
    return result
