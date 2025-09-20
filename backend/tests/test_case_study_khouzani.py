# backend/tests/test_case_study_khouzani.py
"""
Reproduces the “Singhal & Ou (2017)” attack-graph case study
used in Khouzani et al. (2019) “Scalable min–max multi-objective
cyber-security optimisation over probabilistic attack graphs”.
"""

import math
from backend.services.optimiser import optimise_scenario


def _build_case_study():
    """Scenario distilled from Table 1 & Fig. 3 of the paper."""
    return {
        "name": "khouzani_singhal_case",
        # ── controls (all direct costs =1 ; ScDb indirect cost =5) ──
        "control_groups": [
            {
                "id": "ScW",  # patch IE
                "name": "Patch-ScW",
                "levels": [
                    {"level": 0, "name": "None", "cost": 0, "ind_cost": 0, "flow": 1.0},
                    {"level": 1, "name": "Apply", "cost": 1, "ind_cost": 1, "flow": 1e-6},
                ],
            },
            {
                "id": "ScS",  # patch workstation
                "name": "Patch-ScS",
                "levels": [
                    {"level": 0, "name": "None", "cost": 0, "ind_cost": 0, "flow": 1.0},
                    {"level": 1, "name": "Apply", "cost": 1, "ind_cost": 1, "flow": 1e-6},
                ],
            },
            {
                "id": "ScDb",  # patch data-base  (high downtime → ind_cost = 5)
                "name": "Patch-ScDb",
                "levels": [
                    {"level": 0, "name": "None", "cost": 0, "ind_cost": 0, "flow": 1.0},
                    {"level": 1, "name": "Apply", "cost": 1, "ind_cost": 5, "flow": 1e-6},
                ],
            },
        ],
        # ── minimal spine of the full attack-graph ──
        "vertices": [
            {"id": 0, "name": "Start"},
            {"id": 1, "name": "Workstation"},
            {"id": 2, "name": "DB-server"},
        ],
        "edges": [
            {  # exploit IE ⇒ code-exec on workstation
                "source": 0,
                "target": 1,
                "default_flow": 1.0,
                "vulnerability": {
                    "name": "IE-vuln",
                    "controls": ["ScW"],
                    "adjustment": {},
                },
                "url": "",
            },
            {  # hop workstation ⇒ DB-server
                "source": 1,
                "target": 2,
                "default_flow": 1.0,
                "vulnerability": {
                    "name": "DB-vuln",
                    "controls": ["ScS", "ScDb"],
                    "adjustment": {},
                },
                "url": "",
            },
        ],
        "targets": [2],
        "targets_inclusion": {},
    }


# ──────────────────────────────────────────────────────────────
#   TESTS
# ──────────────────────────────────────────────────────────────
def test_tight_indirect_budget():
    """
    With indirect-cost ≤3 the optimiser should *avoid* ScDb (ind_cost = 5)
    but still pick both cheap patches ScW & ScS.
    """
    scen = _build_case_study()
    res = optimise_scenario(scen, budget=10, indirect_budget=3)

    chosen = {c["group_id"] for c in res["selected_controls"]}
    assert "ScDb" not in chosen, "DB patch should be skipped (too expensive)"
    assert {"ScW", "ScS"} <= chosen, "Workstation & browser patches expected"

    assert res["max_flow_to_targets"] <= 1e-6


def test_relaxed_indirect_budget():
    """
    Once indirect-budget ≥ 10 the optimiser can afford all three patches,
    driving attack success probability practically to zero.
    """
    scen = _build_case_study()
    res = optimise_scenario(scen, budget=10, indirect_budget=10)

    chosen = {c["group_id"] for c in res["selected_controls"]}
    assert {"ScW", "ScS", "ScDb"} <= chosen, "All patches should be selected"

    assert res["max_flow_to_targets"] < 1e-9
