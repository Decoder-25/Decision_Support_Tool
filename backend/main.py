from fastapi import FastAPI
from models import OptimisationRequest
from optimiser import optimise_controls

app = FastAPI()

@app.post("/optimise")
def optimise(request: OptimisationRequest):
    result = optimise_controls(request)
    return result
