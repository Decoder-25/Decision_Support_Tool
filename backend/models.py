from pydantic import BaseModel
from typing import List

class ControlLevel(BaseModel):
    level_name: str
    cost: float
    indirect_cost: float
    risk_reduction: float

class Control(BaseModel):
    name: str
    levels: List[ControlLevel]

class OptimisationRequest(BaseModel):
    budget: float
    indirect_budget: float
    controls: List[Control]
