# backend/models/scenario.py
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class Control(BaseModel):
    id: str                                 # e.g., 'FW' for firewall
    level: int                              # control level (e.g., 1, 2, 3)
    level_name: Optional[str] = None        # e.g., 'Basic', 'Advanced'
    cost: float
    ind_cost: float = 0                     # indirect cost (default 0)
    flow: float = 1                         # effectiveness (default 1)

class Vulnerability(BaseModel):
    name: str
    controls: List[str]                     # list of control IDs that affect this vulnerability
    adjustment: Dict[str, Dict[str, Any]]   # adjustment for each control id

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
    controls: List[Control]
    vertices: List[Vertex]
    edges: List[Edge]
    targets: List[int]                      # target node IDs in the attack graph
    targets_inclusion: Optional[Dict[int, List[int]]] = Field(default_factory=dict)

    # You can add more fields if you want (e.g. description, created_by, etc.)
