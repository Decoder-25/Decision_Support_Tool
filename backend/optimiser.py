from re import sub, match
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpStatus

def optimise_controls(controls, budget, indirect_budget):
    """
    controls: list of dicts, each with keys "name" and "levels",
              where levels is a list of dicts with
              "level_name", "cost", "indirect_cost", "risk_reduction"
    budget: float, total direct‐cost budget
    indirect_budget: float, total indirect‐cost budget
    """
    prob = LpProblem("Cyber_Optimisation", LpMaximize)

    # 1) build one binary var per control‐level
    x = {}    # map (control_name, level_name) -> var
    flat = [] # list of { control, level_name, cost, indirect_cost, rr }
    def make_safe(s: str):
        t = sub(r'\W+', '_', s)
        if match(r'^\d', t): t = '_'+t
        return t

    for c in controls:
        cname = c["name"]
        for lvl in c["levels"]:
            lname = lvl["level_name"]
            varname = make_safe(f"{cname}__{lname}")
            v = LpVariable(varname, cat="Binary")
            x[(cname,lname)] = v
            flat.append({
                "cname": cname,
                "lvl":    lname,
                "cost":   float(lvl["cost"]),
                "ind":    float(lvl["indirect_cost"]),
                "rr":     float(lvl["risk_reduction"]),
                "var":    v
            })

    if not flat:
        return {"selected": [], "total_cost":0, "total_indirect_cost":0}

    # 2) objective: maximize sum risk_reduction * var
    prob += lpSum( e["rr"]*e["var"] for e in flat ), "TotalRiskReduction"

    # 3) direct budget
    prob += lpSum( e["cost"]*e["var"] for e in flat ) <= budget, "DirectBudget"
    # 4) indirect budget
    prob += lpSum( e["ind"]*e["var"] for e in flat ) <= indirect_budget, "IndirectBudget"

    # 5) at most one level per control
    from collections import defaultdict
    by_control = defaultdict(list)
    for e in flat:
        by_control[e["cname"]].append(e["var"])
    for cname,vars_ in by_control.items():
        prob += lpSum(vars_) <= 1, f"OneLevel_{cname}"

    # 6) solve
    status = prob.solve()
    print("Solver status:", LpStatus[status])

    # 7) collect results
    selected = []
    total_cost = total_ind = 0
    for e in flat:
        if e["var"].varValue == 1:
            selected.append(f"{e['cname']} ({e['lvl']})")
            total_cost += e["cost"]
            total_ind  += e["ind"]

    return {
        "selected_controls": selected,
        "total_cost": total_cost,
        "total_indirect_cost": total_ind
    }
