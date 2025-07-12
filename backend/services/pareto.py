"""
Generate a Pareto frontier for a scenario by repeatedly calling
your existing `optimise_scenario()` with different cost caps (ε‑constraint).
"""

from typing import Any, Dict, List
import copy

from .optimiser import optimise_scenario
from backend.services.patch_scenario import ensure_level0


def _dominates(a: Dict[str, Any], b: Dict[str, Any]) -> bool:
    """Return True if solution *a* weakly dominates *b* (cost & risk lower‑or‑equal, at least one strictly)."""
    return (
        a["total_cost"] <= b["total_cost"]
        and a["max_flow_to_targets"] <= b["max_flow_to_targets"]
        and (
            a["total_cost"] < b["total_cost"]
            or a["max_flow_to_targets"] < b["max_flow_to_targets"]
        )
    )


def generate_pareto_frontier(
    scenario: Dict[str, Any],
    max_budget: float,
    max_indirect_budget: float,
    n_points: int = 25,
) -> List[Dict[str, Any]]:
    
    scenario = ensure_level0(scenario)

    """
    ε‑constraint method:
      – for `n_points` evenly spaced cost caps ε ∈ [0 , max_budget]
      – minimise risk subject to cost ≤ ε
    Returns a list of *non‑dominated* solutions, sorted by cost.
    """

    eps_steps = [max_budget * i / (n_points - 1) for i in range(n_points)]
    raw: List[Dict[str, Any]] = []

    for eps in eps_steps:
        sol = optimise_scenario(
            copy.deepcopy(scenario),
            budget=eps,
            indirect_budget=max_indirect_budget,
        )
        if sol.get("status") == "ok":
            raw.append(sol)

    # ── Pareto filter ─────────────────────────────────────────────
    frontier: List[Dict[str, Any]] = []
    for candidate in raw:
        if any(_dominates(other, candidate) for other in raw if other is not candidate):
            continue
        frontier.append(candidate)

    uniq: Dict[Tuple[float, float], Dict[str, Any]] = {}
    for p in frontier:
        key = (p["total_cost"], p["max_flow_to_targets"])
        if key not in uniq:
            uniq[key] = p
    frontier = sorted(uniq.values(), key=lambda s: s["total_cost"])
    return frontier
