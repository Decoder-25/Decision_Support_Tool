from re import sub, match
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpStatus
from models import OptimisationRequest
from collections import defaultdict
import networkx as nx

def optimise_controls(request: OptimisationRequest) -> dict:
    controls = request.controls
    budget = request.budget
    indirect_budget = request.indirect_budget
    graph = request.graph

    # === LP Setup ===
    prob = LpProblem("Cyber_Optimisation", LpMaximize)
    x = {}
    clean_levels = []

    def make_safe(name: str) -> str:
        safe = sub(r'\W+', '_', name)
        if match(r'^\d', safe):
            safe = '_' + safe
        return safe

    for control in controls:
        for level in control.levels:
            var_name = f"{control.name}_{level.level_name}"
            safe_name = make_safe(var_name)
            var = LpVariable(safe_name, cat="Binary")
            x[safe_name] = var
            clean_levels.append({
                "name": var_name,
                "control_name": control.name,
                "var_name": safe_name,
                "cost": level.cost,
                "indirect_cost": level.indirect_cost,
                "risk_reduction": level.risk_reduction
            })

    if not clean_levels:
        return {"error": "No valid control levels provided."}

    # Objective: Maximize risk reduction
    prob += lpSum(lvl["risk_reduction"] * x[lvl["var_name"]] for lvl in clean_levels), "Total_Risk_Reduction"

    # At most one level per control
    level_map = defaultdict(list)
    for lvl in clean_levels:
        level_map[lvl["control_name"]].append(x[lvl["var_name"]])
    for control, vars_ in level_map.items():
        prob += lpSum(vars_) <= 1, f"OnlyOneLevel_{control}"

    # Budget constraints
    prob += lpSum(lvl["cost"] * x[lvl["var_name"]] for lvl in clean_levels) <= budget, "Total_Budget"
    prob += lpSum(lvl["indirect_cost"] * x[lvl["var_name"]] for lvl in clean_levels) <= indirect_budget, "Indirect_Budget"

    # Solve LP
    status = prob.solve()
    print("Solver status:", LpStatus[status])

    selected_controls = set(
        lvl["control_name"]
        for lvl in clean_levels
        if x[lvl["var_name"]].varValue == 1
    )

    total_cost = sum(
        lvl["cost"] for lvl in clean_levels
        if x[lvl["var_name"]].varValue == 1
    )

    total_ind_cost = sum(
        lvl["indirect_cost"] for lvl in clean_levels
        if x[lvl["var_name"]].varValue == 1
    )

    selected_names = [
        lvl["name"] for lvl in clean_levels
        if x[lvl["var_name"]].varValue == 1
    ]

    # === Graph-Based Flow Analysis ===
    if graph:
        G = nx.DiGraph()

        for v in graph.vertices:
            G.add_node(v.id, name=v.name)

        for edge in graph.edges:
            # Start with full flow
            flow = edge.default_flow

            for control_id in edge.vulnerability.control_ids:
                for lvl in clean_levels:
                    if lvl["control_name"] == control_id and x[lvl["var_name"]].varValue == 1:
                        # Reduce flow based on risk_reduction (e.g., 0.4 means 40% risk blocked)
                        flow *= (1 - lvl["risk_reduction"])

            # Clamp to 0 if flow becomes very small
            flow = max(flow, 0.0)

            # Add edge with reduced capacity
            G.add_edge(edge.source, edge.target, capacity=flow)
            print(f"Edge ({edge.source} → {edge.target}) final flow: {flow}")
            
        source = graph.vertices[0].id
        target = graph.vertices[-1].id

        try:
            flow_value, _ = nx.maximum_flow(G, source, target)
        except Exception as e:
            flow_value = 0

        return {
            "selected_controls": selected_names,
            "total_cost": total_cost,
            "total_indirect_cost": total_ind_cost,
            "max_flow": flow_value
        }

    # === No Graph Case ===
    return {
        "selected_controls": selected_names,
        "total_cost": total_cost,
        "total_indirect_cost": total_ind_cost
    }
