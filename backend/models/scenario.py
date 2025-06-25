# backend/models/scenario.py
from pydantic import BaseModel, Field # type: ignore
from typing import List, Dict, Optional, Any

class ControlLevel(BaseModel):
    level: int                     # 0,1,2 …  (0 = “no control”)
    name: str                      # e.g. “Firewall”, “Patching”
    cost: float
    ind_cost: float = 0.0
    flow: float = 1.0              # Effectiveness (≤1 ⇒ blocks flow)

class ControlGroup(BaseModel):
    id: str                        # Short code, e.g. “N1”
    name: str                      # Human label
    no_control_name: str = "None"  # What to call level 0 in the UI
    levels: List[ControlLevel]     # Ordered list (must include level 0)

class Vulnerability(BaseModel):
    name: str
    controls: List[str]            # IDs of groups that mitigate
    adjustment: Dict[str, Dict[str, Any]] = Field(default_factory=dict)

class Edge(BaseModel):
    source: int
    target: int
    default_flow: float = 1.0
    vulnerability: Vulnerability
    url: Optional[str] = None

class Vertex(BaseModel):
    id: int
    name: str

class Scenario(BaseModel):
    name: str
    control_groups: List[ControlGroup]
    vertices: List[Vertex]
    edges: List[Edge]
    targets: List[int]
    targets_inclusion: Optional[Dict[int, List[int]]] = Field(default_factory=dict)

    # You can add more fields if you want (e.g. description, created_by, etc.)
