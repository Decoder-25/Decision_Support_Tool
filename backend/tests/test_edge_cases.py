# backend/tests/test_edge_cases.py
import math
import pytest

from backend.services.optimiser import optimise_scenario


# ───────────────────────────────────────────────────────────────
# 1. No control-groups at all
# ───────────────────────────────────────────────────────────────
def test_no_control_groups():
    scenario = {
        "name": "no-controls",
        "control_groups": [],
        "vertices": [{"id": 0, "name": "A"}, {"id": 1, "name": "B"}],
        "edges": [
            {
                "source": 0,
                "target": 1,
                "default_flow": 1.0,
                "vulnerability": {"name": "", "controls": [], "adjustment": {}},
                "url": "",
            }
        ],
        "targets": [1],
        "targets_inclusion": {},
    }

    sol = optimise_scenario(scenario, budget=100, indirect_budget=100)
    assert sol["status"] == "ok"
    assert sol["total_cost"] == 0
    assert math.isclose(sol["max_flow_to_targets"], 1.0, rel_tol=1e-9)
    assert sol["selected_controls"] == []


# ───────────────────────────────────────────────────────────────
# 2. Missing level-0 should be auto-inserted by ensure_level0
# ───────────────────────────────────────────────────────────────
def test_ensure_level0_fallback():
    scenario = {
        "name": "missing-level0",
        "control_groups": [
            {
                "id": "cg1",
                "name": "Patch",
                # deliberately omit level 0
                "levels": [
                    {"level": 1, "name": "Apply", "cost": 2, "ind_cost": 0, "flow": 0.2}
                ],
            }
        ],
        "vertices": [{"id": 0, "name": "S"}, {"id": 1, "name": "T"}],
        "edges": [
            {
                "source": 0,
                "target": 1,
                "default_flow": 1.0,
                "vulnerability": {"name": "", "controls": ["cg1"], "adjustment": {}},
                "url": "",
            }
        ],
        "targets": [1],
        "targets_inclusion": {},
    }

    sol = optimise_scenario(scenario, budget=0, indirect_budget=0)
    # optimiser should still succeed and pick the auto-added level-0 only
    assert sol["status"] == "ok"
    assert sol["total_cost"] == 0
    assert len(sol["selected_controls"]) == 0 or all(c["level"] == 0 for c in sol["selected_controls"])


# ───────────────────────────────────────────────────────────────
# 3. Multiple targets → objective uses WORST path
# ───────────────────────────────────────────────────────────────
def test_multiple_targets_worst_case():
    scenario = {
        "name": "two-targets",
        "control_groups": [],
        "vertices": [
            {"id": 0, "name": "Start"},
            {"id": 1, "name": "Target-1"},
            {"id": 2, "name": "Target-2"},
        ],
        "edges": [
            {
                "source": 0,
                "target": 1,
                "default_flow": 0.3,
                "vulnerability": {"name": "", "controls": [], "adjustment": {}},
                "url": "",
            },
            {
                "source": 0,
                "target": 2,
                "default_flow": 0.8,
                "vulnerability": {"name": "", "controls": [], "adjustment": {}},
                "url": "",
            },
        ],
        "targets": [1, 2],
        "targets_inclusion": {},
    }

    sol = optimise_scenario(scenario, budget=0, indirect_budget=0)
    assert sol["status"] == "ok"
    assert math.isclose(sol["max_flow_to_targets"], 0.8, rel_tol=1e-6)
