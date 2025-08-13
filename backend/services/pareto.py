"""
Generate a Pareto frontier for a scenario by repeatedly calling
`optimise_scenario()` with different cost caps (ε-constraint).
"""

from typing import Any, Dict, List, Tuple
import copy

from .optimiser import optimise_scenario            # local optimiser
from backend.services.patch_scenario import ensure_level0


# ---------------------------------------------------------------------------
# Helper: dominance test that works for either sweep axis
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Helper: dominance test for either sweep axis
# ---------------------------------------------------------------------------
def _dominates(a: Dict[str, Any],
               b: Dict[str, Any],
               sweep_direct: bool) -> bool:
    """
    True if *a* weakly dominates *b* on the swept budget axis + risk.
    sweep_direct == True  → compare total_cost
    sweep_direct == False → compare total_indirect_cost
    """
    axis_a = a["total_cost"]            if sweep_direct else a["total_indirect_cost"]
    axis_b = b["total_cost"]            if sweep_direct else b["total_indirect_cost"]
    risk_a = a["max_flow_to_targets"]
    risk_b = b["max_flow_to_targets"]

    return (
        axis_a <= axis_b and
        risk_a <= risk_b and
        (axis_a < axis_b or risk_a < risk_b)     # at least one strictly better
    )


# ---------------------------------------------------------------------------
# Main entry
# ---------------------------------------------------------------------------
def generate_pareto_frontier(
    scenario: Dict[str, Any],
    max_budget: float,
    max_indirect_budget: float,
    n_points: int = 25,
) -> List[Dict[str, Any]]:

    scenario = ensure_level0(scenario)

    # ── decide which budget axis we keep fixed / sweep ─────────────────────
    # decide which axis we sweep
    if max_budget == 0 and max_indirect_budget > 0:    # indirect-cost frontier
        sweep_direct = False
        eps_steps = [max_indirect_budget * i / (n_points - 1)     # ← 25 values
                    for i in range(n_points)]
    else:                                              # direct-cost frontier
        sweep_direct = True
        eps_steps = [max_budget * i / (n_points - 1)              # ← 25 values
                    for i in range(n_points)]
            # 0,1,2,…,cap

    # ── run optimiser for every ε cap on the swept axis ────────────────────
    raw: List[Dict[str, Any]] = []
    for eps in eps_steps:
        if sweep_direct:
            sol = optimise_scenario(copy.deepcopy(scenario),
                                    budget=eps,
                                    indirect_budget=max_indirect_budget)
        else:
            sol = optimise_scenario(copy.deepcopy(scenario),
                                    budget=max_budget,
                                    indirect_budget=eps)
        if sol.get("status") == "ok":
            raw.append(sol)

    # ── Pareto filter ───────────────────────────────────────────────────────
    frontier: List[Dict[str, Any]] = []
    for cand in raw:
        if any(_dominates(other, cand, sweep_direct) for other in raw if other is not cand):
            continue
        frontier.append(cand)

    # ── deduplicate identical (axis, risk) pairs ───────────────────────────
    uniq: Dict[Tuple[float, float], Dict[str, Any]] = {}
    for p in frontier:
        axis_val = p["total_cost"] if sweep_direct else p["total_indirect_cost"]
        key      = (axis_val, p["max_flow_to_targets"])
        uniq.setdefault(key, p)

    # sort by the swept axis for nicer plotting
    frontier_sorted = sorted(
        uniq.values(),
        key=lambda s: (s["total_cost"] if sweep_direct else s["total_indirect_cost"])
    )
    return frontier_sorted
