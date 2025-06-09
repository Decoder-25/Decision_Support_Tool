from re import sub, match
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpStatus

def optimise_controls(controls, budget, indirect_budget):
    print("Received controls:", controls)
    print("Budget:", budget)

    # Now create a MAXIMISATION problem
    prob = LpProblem("Cyber_Optimisation", LpMaximize)

    # 1) sanitise names & build variables
    x = {}
    clean_controls = []
    def make_safe(name: str) -> str:
        safe = sub(r'\W+', '_', name)
        if match(r'^\d', safe):
            safe = '_' + safe
        return safe

    for c in controls:
        try:
            name = c["name"]
            cost = float(c["cost"])
            ind_cost = float(c["indirect_cost"])
            rr   = float(c["risk_reduction"])
            vn   = make_safe(name)
            var  = LpVariable(vn, cat="Binary")
            x[vn] = var
            clean_controls.append({
                "name":           name,
                "var_name":       vn,
                "cost":           cost,
                "indirect_cost": ind_cost,
                "risk_reduction": rr
            })
        except Exception as e:
            print("Skipping invalid control:", c, "Error:", e)

    if not clean_controls:
        return {"selected_controls": [], "total_cost": 0, "total_indirect_cost": 0}

    # 2) Objective: MAXIMIZE total risk reduction
    prob += lpSum(
        c["risk_reduction"] * x[c["var_name"]]
        for c in clean_controls
    ), "Total_Risk_Reduction"

    # 3) Budget constraint
    prob += lpSum(
        c["cost"] * x[c["var_name"]]
        for c in clean_controls
    ) <= float(budget), "Total_Budget"

    prob += lpSum(
        c["indirect_cost"] * x[c["var_name"]] 
        for c in clean_controls
    ) <= float(indirect_budget), "Indirect_Cost_Budget"

    # 4) Solve
    status = prob.solve()
    print("Solver status:", LpStatus[status])
    for vn, var in x.items():
        print(f"  {vn} = {var.varValue}")

    selected = [
        c["name"] for c in clean_controls
        if x[c["var_name"]].varValue == 1
    ]
    total_cost = sum(
        c["cost"] for c in clean_controls
        if x[c["var_name"]].varValue == 1
    )

    total_ind_cost = sum(c["indirect_cost"] for c in clean_controls if x[c["var_name"]].varValue == 1)

    return {
        "selected_controls": selected,
        "total_cost": total_cost,
        "total_indirect_cost": total_ind_cost
    }
