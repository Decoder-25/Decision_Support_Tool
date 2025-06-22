# backend/services/optimiser.py

from typing import Dict, Any, List
from pulp import LpProblem, LpVariable, LpMinimize, LpInteger, lpSum, PULP_CBC_CMD
import math

def optimise_scenario(scenario: Dict[str, Any], budget: float, indirect_budget: float) -> Dict[str, Any]:
    """
    Given a scenario dict and budget constraints, find the optimal set of controls
    to minimise max flow to targets. Returns selected controls, cost, and other stats.
    """
    controls = []
    control_lookup = {}
    for c in scenario['controls']:
        c_tuple = (c['id'], c['level'])
        controls.append(c_tuple)
        control_lookup[c_tuple] = c

    nodes = [v['id'] for v in scenario['vertices']]
    edges = scenario['edges']
    targets = scenario['targets']

    # Add a sink node for risk flow calculation
    sink = max(nodes) + 1
    nodes.append(sink)
    for t in targets:
        edges.append({
            'source': t,
            'target': sink,
            'default_flow': 1.0,
            'vulnerability': {
                'name': '',
                'controls': [],
                'adjustment': {}
            }
        })

    # Map controls affecting each edge
    control_ind = {}
    for e in edges:
        edge_controls = []
        vuln = e['vulnerability']
        for ctrl_id in vuln['controls']:
            for c in controls:
                if c[0] == ctrl_id:
                    edge_controls.append(c)
        control_ind[(e['source'], e['target'])] = edge_controls

    def cost(c):
        return control_lookup[c]['cost']
    def ind_cost(c):
        return control_lookup[c]['ind_cost']
    def pi(edge):
        return edge.get('default_flow', 1.0)
    def p(c, edge):
        ctrl_id = c[0]
        vuln = edge['vulnerability']
        adj = vuln.get('adjustment', {}).get(ctrl_id)
        if adj and 'flow' in adj:
            return min([control_lookup[c]['flow'] * adj['flow'], adj.get('max_flow', 1)])
        elif adj and 'custom' in adj:
            # Advanced: custom adjustment curves
            return adj['custom'][control_lookup[c]['level'] - 1]
        else:
            return control_lookup[c]['flow']

    # === LP Model ===
    model = LpProblem("optimise_cysec_scenario", LpMinimize)
    x = LpVariable.dicts("x", controls, lowBound=0, upBound=1, cat=LpInteger) # control selected
    lam = LpVariable.dicts("lam", nodes)

    # Objective: Minimise (max flow to sink) + (small weight on cost)
    eps = 0.00001
    model += (lpSum([lam[sink] - lam[min(nodes)]])
              + eps * lpSum([x[c] * cost(c) for c in controls])
              + eps * lpSum([x[c] * ind_cost(c) for c in controls]))

    # Budget constraints
    model += lpSum([x[c] * cost(c) for c in controls]) <= budget
    model += lpSum([x[c] * ind_cost(c) for c in controls]) <= indirect_budget

    # At most one level per control group
    for c in controls:
        siblings = [c1 for c1 in controls if c1[0] == c[0]]
        if len(siblings) > 1:
            model += lpSum([x[c1] for c1 in siblings]) <= 1

    # Flow constraints (risk propagation)
    for e in edges:
        src, tgt = e['source'], e['target']
        model += lam[tgt] - lam[src] >= math.log(pi(e)) + lpSum([x[c] * math.log(p(c, e)) for c in control_ind[(src, tgt)]])

    # Solve
    model.solve(PULP_CBC_CMD(msg=0))
    if not model.status == 1:
        return {"status": "error", "message": "No feasible solution found"}

    # Gather results
    selected_controls = [c for c in controls if x[c].varValue == 1]
    selected_ctrls_details = [control_lookup[c] for c in selected_controls]
    total_cost = sum(cost(c) for c in selected_controls)
    total_ind_cost = sum(ind_cost(c) for c in selected_controls)
    max_flow = math.exp(model.objective.value())

    # Explanation (simple transparency)
    explanation = [
        {
            "id": ctrl['id'],
            "level": ctrl['level'],
            "cost": ctrl['cost'],
            "ind_cost": ctrl['ind_cost'],
            "flow": ctrl['flow'],
            "level_name": ctrl.get('level_name', ''),
        }
        for ctrl in selected_ctrls_details
    ]

    return {
        "status": "ok",
        "selected_controls": explanation,
        "total_cost": total_cost,
        "total_indirect_cost": total_ind_cost,
        "max_flow_to_targets": max_flow
    }
