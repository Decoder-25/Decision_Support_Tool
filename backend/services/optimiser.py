# backend/services/optimiser.py
from typing import Dict, Any, List, Tuple
from pulp import LpProblem, LpVariable, LpMinimize, LpInteger, lpSum, PULP_CBC_CMD 
import math
import copy
from backend.services.patch_scenario import ensure_level0



def optimise_scenario(
    scenario: Dict[str, Any],
    budget: float,
    indirect_budget: float
) -> Dict[str, Any]:
    
    scenario = copy.deepcopy(scenario)
    scenario = ensure_level0(scenario)
    """
    Given a scenario dict (with control_groups) and budget constraints,
    find the optimal set of controls to minimise max flow to targets.
    Returns selected controls, cost, and other stats.
    """

    # ────────────────────────────────────────────────────────────────
    # 1.  FLATTEN control_groups ➜ controls list expected by solver
    #     Key = (group_id, level_index)
    # ────────────────────────────────────────────────────────────────
    controls: List[Tuple[str, int]] = []
    control_lookup: Dict[Tuple[str, int], Dict[str, Any]] = {}

    for grp in scenario["control_groups"]:
        for lvl in grp["levels"]:
            key = (grp["id"], lvl["level"])
            controls.append(key)
            control_lookup[key] = {
                "id": grp["id"],
                "group_name": grp["name"],
                "level": lvl["level"],
                "level_name": lvl["name"],
                "cost": lvl["cost"],
                "ind_cost": lvl["ind_cost"],
                "flow": lvl["flow"],
            }

    # ────────────────────────────────────────────────────────────────
    # 2.  vertices / edges / targets
    # ────────────────────────────────────────────────────────────────
    nodes   = [v["id"] for v in scenario["vertices"]]
    edges   = scenario["edges"]
    targets = scenario["targets"]

    # Add a sink node for risk-flow evaluation
    sink = max(nodes) + 1
    nodes.append(sink)
    SOURCE = min(nodes) 

    for t in targets:
        edges.append(
            {
                "source": t,
                "target": sink,
                "default_flow": 1.0,
                "vulnerability": {"name": "", "controls": [], "adjustment": {}},
            }
        )

    # Map which (flattened) controls mitigate each edge
    control_ind: Dict[Tuple[int, int], List[Tuple[str, int]]] = {}
    for e in edges:
        mitigators = []
        vuln = e["vulnerability"]
        for grp_id in vuln["controls"]:
            for key in controls:
                if key[0] == grp_id:  # same group
                    mitigators.append(key)
        control_ind[(e["source"], e["target"])] = mitigators

    # Helper lambdas
    cost      = lambda c: control_lookup[c]["cost"]
    ind_cost  = lambda c: control_lookup[c]["ind_cost"]
    pi        = lambda edge: edge.get("default_flow", 1.0)

    def p(c, edge):
        grp_id = c[0]
        vuln   = edge["vulnerability"]
        adj    = vuln.get("adjustment", {}).get(grp_id)
        if adj and "flow" in adj:
            return min(control_lookup[c]["flow"] * adj["flow"], adj.get("max_flow", 1))
        elif adj and "custom" in adj:
            return adj["custom"][control_lookup[c]["level"] - 1]
        return control_lookup[c]["flow"]

    # ────────────────────────────────────────────────────────────────
    # 3.  Stackelberg-dual MILP 
    # ────────────────────────────────────────────────────────────────
   
   # ──────────────────────────────────────────────────────────

    model = LpProblem("optimise_scenario", LpMinimize)

    # keep λ free (positive or negative)
    x   = LpVariable.dicts("x", controls, lowBound=0, upBound=1, cat=LpInteger)
    lam = LpVariable.dicts("lam", nodes, lowBound=None)
    EPS = 1e-5 


    # ── objective:  minimise  (-λ_sink + λ_source)  +  ε·(direct+indirect cost)
    model += (
        -lam[sink] + lam[SOURCE]
        + EPS * lpSum(x[c] *  cost(c)     for c in controls)
        + EPS * lpSum(x[c] * ind_cost(c)  for c in controls)
    )

    # ── budget constraints
    model += lpSum(x[c] *  cost(c)     for c in controls) <= budget
    model += lpSum(x[c] * ind_cost(c)  for c in controls) <= indirect_budget

    # ── at most one level per control group
    for grp in scenario["control_groups"]:
        gid = grp["id"]
        siblings = [c for c in controls if c[0] == gid]
        if len(siblings) > 1:
            model += lpSum(x[s] for s in siblings) <= 1

    # ── dual feasibility constraints   λ_v − λ_u ≥ log(π_uv) + Σ x_c·log(p_c,uv)
    for e in edges:
        u, v = e["source"], e["target"]
        model += (
            lam[u] - lam[v] >= math.log(pi(e))
            + lpSum(x[c] * math.log(p(c, e)) for c in control_ind[(u, v)])
        )



    model.solve(PULP_CBC_CMD(msg=0))
    if model.status != 1:
        return {"status": "error", "message": "No feasible solution found"}

    # ────────────────────────────────────────────────────────────────
    # 4.  Results
    # ────────────────────────────────────────────────────────────────
    selected = [c for c in controls if x[c].varValue == 1]
    total_c  = sum(cost(c)     for c in selected)
    total_ic = sum(ind_cost(c) for c in selected)
    flow_part = -lam[sink].varValue + lam[SOURCE].varValue
    raw_flow  = math.exp(flow_part)
    max_flow  = max(raw_flow, 1e-12)


    explanation = [
        {
            "group_id":     ctrl["id"],
            "group_name":   ctrl["group_name"],
            "level":        ctrl["level"],
            "level_name":   ctrl["level_name"],
            "cost":         ctrl["cost"],
            "ind_cost":     ctrl["ind_cost"],
            "flow":         ctrl["flow"],
        }
        for key in selected
        for ctrl in (control_lookup[key],)
    ]

    return {
        "status": "ok",
        "selected_controls": explanation,
        "total_cost": total_c,
        "total_indirect_cost": total_ic,
        "max_flow_to_targets": max_flow,
    }
