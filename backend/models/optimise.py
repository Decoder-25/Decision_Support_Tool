# backend/models/optimise.py

from pydantic import BaseModel # type: ignore
from typing import List

class ControlSelection(BaseModel):
    group_id: str
    group_name: str
    level: int
    level_name: str
    cost: float
    ind_cost: float
    flow: float

class OptimiseResponse(BaseModel):
    status: str
    selected_controls: List[ControlSelection]
    total_cost: float
    total_indirect_cost: float
    max_flow_to_targets: float

class ParetoPoint(BaseModel):
    """
    A single efficient solution on the Pareto front.
    • cost  = direct budget spent
    • indirect_cost = indirect budget spent
    • risk  = max_flow_to_targets (smaller ⇒ safer)
    """
    cost: float
    indirect_cost: float
    risk: float
    selected_controls: List[ControlSelection]

class ParetoFrontierResponse(BaseModel):
    status: str              # "ok"
    frontier: List[ParetoPoint]
