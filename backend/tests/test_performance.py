import random
import pytest
from backend.services.optimiser import optimise_scenario

def make_random_scenario(n_vertices=50, n_controls=10):
    # fully connected DAG from 0→1→2→…→n_vertices-1
    vertices = [{"id": i, "name": str(i)} for i in range(n_vertices)]
    edges = []
    for i in range(n_vertices-1):
        edges.append({
            "source": i, "target": i+1,
            "default_flow": random.uniform(0.1,1.0),
            "vulnerability": {"name": "", "controls": [], "adjustment": {}},
            "url": ""
        })
    # add n_controls groups, each with one “patch” level
    control_groups = []
    for j in range(n_controls):
        control_groups.append({
            "id": f"cg{j}",
            "name": f"Control{j}",
            "levels": [
                {"level": 0, "name": "None",   "cost": 0, "ind_cost":0, "flow":1.0},
                {"level": 1, "name": "Patch",  "cost": 1, "ind_cost":0, 
                 "flow": random.uniform(0.01,0.5)}
            ]
        })
        # attach every control to a random edge
        edges[j % len(edges)]["vulnerability"]["controls"].append(f"cg{j}")

    return {
        "name": "rand",
        "control_groups": control_groups,
        "vertices": vertices,
        "edges": edges,
        "targets": [n_vertices-1],
        "targets_inclusion": {}
    }

@pytest.mark.parametrize("nv, nc", [
    (50, 10),
    (100, 20),
    (200, 40),
])
def test_optimiser_scaling(benchmark, nv, nc):
    scen = make_random_scenario(n_vertices=nv, n_controls=nc)
    # benchmark it
    res = benchmark(lambda: optimise_scenario(scen, budget=nc, indirect_budget=0))
    # sanity check
    assert res["status"] == "ok"
