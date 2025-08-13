import math
from backend.services.optimiser import optimise_scenario
from backend.services.resilience import estimate_attacks_before_breach


def _toy_scenario(p_flow: float):
    """One-edge graph where residual flow = p_flow."""
    return {
        "name": "toy",
        "control_groups": [],
        "vertices": [{"id": 0, "name": "S"}, {"id": 1, "name": "T"}],
        "edges": [
            {"source": 0, "target": 1, "default_flow": p_flow,
             "vulnerability": {"name": "", "controls": [], "adjustment": {}},
             "url": ""},
        ],
        "targets": [1],
        "targets_inclusion": {},
    }


def test_resilience_estimator():
    # flow = 0.25 → theoretical E[N]=4
    scen = _toy_scenario(0.25)
    res  = optimise_scenario(scen, budget=0, indirect_budget=0)
    stats = estimate_attacks_before_breach(res, n_runs=5000)

    assert math.isclose(stats["mean"], 4.0, rel_tol=0.05)
    # 95 % CI should straddle the true expectation
    assert stats["ci_low"] <= 4.0 <= stats["ci_high"]
