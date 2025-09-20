# backend/models/scenario.py
from pydantic import BaseModel, Field 
from typing import List, Dict, Optional, Any

class ControlLevel(BaseModel):
    level: int                     
    name: str                      
    cost: float
    ind_cost: float = 0.0
    flow: float = 1.0             

class ControlGroup(BaseModel):
    id: str                        
    name: str                      
    no_control_name: str = "None"  
    levels: List[ControlLevel]     

class Vulnerability(BaseModel):
    name: str
    controls: List[str]            
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
