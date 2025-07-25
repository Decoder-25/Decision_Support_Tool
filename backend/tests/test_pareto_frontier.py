# test_pareto_frontier.py
import math
from backend.services.pareto import generate_pareto_frontier

def test_do_nothing_solution():
    # 1. Define a minimal scenario
    scenario = {
        "name": "test-scenario",
        "control_groups": [
            {
                "id": "g1",
                "name": "Firewall",
                "levels": [
                    {"level": 0, "name": "None", "cost": 0, "ind_cost": 0, "flow": 1},
                    {"level": 1, "name": "Firewall", "cost": 10, "ind_cost": 0, "flow": 0.2},
                ],
            },
            {
                "id": "g2",
                "name": "Antivirus",
                "levels": [
                    {"level": 0, "name": "None", "cost": 0, "ind_cost": 0, "flow": 1},
                    {"level": 1, "name": "Antivirus", "cost": 5, "ind_cost": 0, "flow": 0.5},
                ],
            },
        ],
        "vertices": [{"id": 0, "name": "Start"}, {"id": 1, "name": "Target"}],
        "edges": [
            {
                "source": 0,
                "target": 1,
                "default_flow": 1,
                "vulnerability": {
                    "name": "Exploit",
                    "controls": ["g1", "g2"],
                    "adjustment": {},
                },
                "url": "",
            }
        ],
        "targets": [1],
        "targets_inclusion": {},
    }

    # 2. Run the Pareto frontier function with 2 steps (cost 0 and cost max)
    frontier = generate_pareto_frontier(scenario, max_budget=15, max_indirect_budget=0, n_points=2)

    # 3. The first solution should be do-nothing (cost = 0)
    do_nothing = frontier[0]
    assert do_nothing["total_cost"] == 0
    # You may need to check selected_controls format
    # Example: If empty list or all are "level":0
    for group in scenario["control_groups"]:
        found = [c for c in do_nothing["selected_controls"] if c["group_id"] == group["id"]]
        if found:
            assert found[0]["level"] == 0
    # 4. The risk should be highest at cost=0
    risks = [sol["max_flow_to_targets"] for sol in frontier]
    assert risks[0] >= risks[-1]

    # 5. At higher budgets, at least one control is selected
    if len(frontier) > 1:
        selected = frontier[-1]["selected_controls"]
        assert any(c["level"] > 0 for c in selected)

def test_pareto_frontier_nonzero():
    scenario = {
        "name": "test-scenario",
        "control_groups": [
            {
                "id": "cg1",
                "name": "Firewall",
                "levels": [
                    {"level": 0, "name": "None", "cost": 0, "ind_cost": 0, "flow": 1.0},
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
                    "name": "Open Port",
                    "controls": ["cg1"],
                    "adjustment": {},
                },
                "url": "",
            }
        ],
        "targets": [1],
        "targets_inclusion": {},
    }
    # Max budget enough for both options
    frontier = generate_pareto_frontier(scenario, max_budget=5, max_indirect_budget=0, n_points=2)
    points = [(sol["total_cost"], sol["max_flow_to_targets"]) for sol in frontier]

    # Check do-nothing is present
    assert any(
        cost == 0 and math.isclose(risk, 1.0, rel_tol=1e-6)
        for cost, risk in points
    )
    # Check "with control" is present
    assert any(
        cost == 5 and math.isclose(risk, 0.3, rel_tol=1e-3)
        for cost, risk in points
    )
    assert len(points) == 2