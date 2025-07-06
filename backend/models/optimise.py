# backend/models/optimise.py

from pydantic import BaseModel
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
