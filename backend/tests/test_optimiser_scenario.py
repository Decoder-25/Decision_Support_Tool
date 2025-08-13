# backend/tests/test_optimiser_scenario.py
import math
import pytest
from backend.services.optimiser import optimise_scenario

@pytest.fixture
def simple_scenario():
    return {
        "name": "test-simple",
        "control_groups": [
            {
                "id": "cg1",
                "name": "Firewall",
                "levels": [
                    {"level": 0, "name": "None",     "cost": 0, "ind_cost": 0, "flow": 1.0},
                    {"level": 1, "name": "Basic FW", "cost": 5, "ind_cost": 0, "flow": 0.3},
                ],
            }
        ],
        "vertices": [{"id": 0, "name": "A"}, {"id": 1, "name": "B"}],
        "edges": [
            {
                "source": 0,
                "target": 1,
                "default_flow": 1.0,
                "vulnerability": {
                    "name": "Exploit",
                    "controls": ["cg1"],
                    "adjustment": {},
                },
                "url": "",
            }
        ],
        "targets": [1],
        "targets_inclusion": {},
    }

def test_zero_budget(simple_scenario):
    sol = optimise_scenario(simple_scenario, budget=0, indirect_budget=0)
    assert sol["status"] == "ok"
    # No money → no controls
    assert sol["total_cost"] == 0
    # Flow remains at 1.0
    assert math.isclose(sol["max_flow_to_targets"], 1.0, rel_tol=1e-6)
    assert sol["selected_controls"] == []  # or all level==0

def test_minimal_control(simple_scenario):
    sol = optimise_scenario(simple_scenario, budget=5, indirect_budget=0)
    assert sol["status"] == "ok"
    # Should pick the one control
    assert sol["total_cost"] == 5
    assert math.isclose(sol["max_flow_to_targets"], 0.3, rel_tol=1e-6)
    assert len(sol["selected_controls"]) == 1
    c = sol["selected_controls"][0]
    assert c["group_id"] == "cg1" and c["level"] == 1

def test_tradeoff_two_controls():
    # Two groups, one cheaper but weaker, one pricier but stronger
    scenario = {
        "name": "two-controls",
        "control_groups": [
            {
                "id": "g1",
                "name": "Weak",
                "levels": [
                    {"level":0,"name":"None","cost":0,"ind_cost":0,"flow":1.0},
                    {"level":1,"name":"Weak","cost":5,"ind_cost":0,"flow":0.5},
                ],
            },
            {
                "id": "g2",
                "name": "Strong",
                "levels": [
                    {"level":0,"name":"None","cost":0,"ind_cost":0,"flow":1.0},
                    {"level":1,"name":"Strong","cost":10,"ind_cost":0,"flow":0.2},
                ],
            },
        ],
        "vertices":[{"id":0,"name":"S"},{"id":1,"name":"T"}],
        "edges":[
            {
                "source":0,"target":1,"default_flow":1.0,
                "vulnerability":{"name":"v","controls":["g1","g2"],"adjustment":{}},
                "url":"",
            }
        ],
        "targets":[1],"targets_inclusion":{},
    }
    # budget=10 allows either {g2=1} or {g1=1} but g2 is better risk
    sol = optimise_scenario(scenario, budget=10, indirect_budget=0)
    assert sol["status"] == "ok"
    assert sol["total_cost"] == 10
    # picks the stronger (flow 0.2) over the weaker (flow 0.5)
    assert math.isclose(sol["max_flow_to_targets"], 0.2, rel_tol=1e-6)
    assert any(c["group_id"]=="g2" and c["level"]==1 for c in sol["selected_controls"])
