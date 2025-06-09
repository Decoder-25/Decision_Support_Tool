from pydantic import BaseModel
from typing import List

class Control(BaseModel):
    name: str
    cost: float
    indirect_cost: float
    risk_reduction: float

class OptimisationRequest(BaseModel):
    budget: float
    indirect_budget: float
    controls: List[Control]
