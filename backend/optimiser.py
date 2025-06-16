from re import sub, match
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpStatus
from models import OptimisationRequest

def optimise_controls(request: OptimisationRequest) -> dict:
    controls = request.controls
    budget = request.budget
    indirect_budget = request.indirect_budget
    graph = request.graph  # Optional, currently unused

    print("Received controls:", controls)
    print("Budget:", budget)
    print("Indirect budget:", indirect_budget)

    # If graph data is present, you can eventually route to a graph-based solver here
    if graph:
        vertices = graph.vertices
        edges = graph.edges

        # TEMP: assume start = first vertex, target = last vertex
        source = vertices[0].id
        target = vertices[-1].id

        max_flow = compute_max_flow(graph, source, target)

        return {
            "message": "Basic max-flow computed (no controls yet)",
            "source": source,
            "target": target,
            "max_flow": max_flow
        }

    # === Standard Optimisation Logic (No Graph) ===

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
                "var_name": safe_name,
                "cost": level.cost,
                "indirect_cost": level.indirect_cost,
                "risk_reduction": level.risk_reduction
            })

    if not clean_levels:
        return {"error": "No valid control levels provided."}

    # Objective: Maximize total risk reduction
    prob += lpSum(
        lvl["risk_reduction"] * x[lvl["var_name"]]
        for lvl in clean_levels
    ), "Total_Risk_Reduction"

    from collections import defaultdict
    level_map = defaultdict(list)
    for lvl in clean_levels:
        control_name = lvl["name"].split("_")[0]  # e.g., Firewall_Basic → Firewall
        level_map[control_name].append(x[lvl["var_name"]])

    for control, vars_ in level_map.items():
        prob += lpSum(vars_) <= 1, f"OnlyOneLevel_{control}"

    # Constraints
    prob += lpSum(
        lvl["cost"] * x[lvl["var_name"]]
        for lvl in clean_levels
    ) <= float(budget), "Total_Budget"

    prob += lpSum(
        lvl["indirect_cost"] * x[lvl["var_name"]]
        for lvl in clean_levels
    ) <= float(indirect_budget), "Indirect_Budget"

    # Solve
    status = prob.solve()
    print("Solver status:", LpStatus[status])

    selected = [
        lvl["name"] for lvl in clean_levels
        if x[lvl["var_name"]].varValue == 1
    ]
    total_cost = sum(
        lvl["cost"] for lvl in clean_levels
        if x[lvl["var_name"]].varValue == 1
    )
    total_ind_cost = sum(
        lvl["indirect_cost"] for lvl in clean_levels
        if x[lvl["var_name"]].varValue == 1
    )

    return {
        "selected_controls": selected,
        "total_cost": total_cost,
        "total_indirect_cost": total_ind_cost
    }


def compute_max_flow(graph, source_id: int, target_id: int) -> float:
    """
    Simple BFS-based max flow calculation with unit capacity per edge (default_flow).
    Ignores controls for now. Pure reachability flow.
    """
    from collections import deque, defaultdict

    adj = defaultdict(list)
    capacities = {}

    for edge in graph.edges:
        u, v = edge.source, edge.target
        adj[u].append(v)
        capacities[(u, v)] = edge.default_flow

    total_flow = 0

    while True:
        # Step 1: Find path using BFS
        parent = {}
        visited = set()
        queue = deque([source_id])
        visited.add(source_id)

        while queue:
            u = queue.popleft()
            for v in adj[u]:
                if (u, v) in capacities and capacities[(u, v)] > 0 and v not in visited:
                    parent[v] = u
                    visited.add(v)
                    queue.append(v)

        if target_id not in visited:
            break

        # Step 2: Bottleneck capacity
        flow = float('inf')
        v = target_id
        while v != source_id:
            u = parent[v]
            flow = min(flow, capacities[(u, v)])
            v = u

        # Step 3: Update residual graph
        v = target_id
        while v != source_id:
            u = parent[v]
            capacities[(u, v)] -= flow
            capacities[(v, u)] = capacities.get((v, u), 0) + flow
            v = u

        total_flow += flow

    return total_flow

