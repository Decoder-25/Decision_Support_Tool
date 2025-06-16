from pydantic import BaseModel
from typing import List, Optional

# ========== Control Configuration ==========

class ControlLevel(BaseModel):
    level_name: str
    cost: float
    indirect_cost: float
    risk_reduction: float

class Control(BaseModel):
    name: str
    levels: List[ControlLevel]


# ========== Attack Graph Structure ==========


class Vertex(BaseModel):
    id: int
    name: str


class EdgeVulnerability(BaseModel):
    name: str
    control_ids: List[str]  # List of control names/IDs that apply to this vulnerability


class Edge(BaseModel):
    source: int
    target: int
    default_flow: float = 1.0
    vulnerability: EdgeVulnerability


class AttackGraph(BaseModel):
    vertices: List[Vertex]
    edges: List[Edge]


# ========== Full Optimisation Request ==========

class OptimisationRequest(BaseModel):
    budget: float
    indirect_budget: float
    controls: List[Control]
    graph: Optional[AttackGraph] = None
