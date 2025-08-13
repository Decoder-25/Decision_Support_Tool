# backend/tests/case_study_singhal.py

from backend.services.pareto import generate_pareto_frontier

ε = 1e-6

scenario = {
  "control_groups": [
    {"id":"ScW",  "name":"Patch WS",   "levels":[
       {"level":0,"name":"None","cost":1,"ind_cost":1,"flow":1},
       {"level":1,"name":"Patch WS","cost":1,"ind_cost":1,"flow":ε},
    ]},
    {"id":"ScS",  "name":"Patch Web",  "levels":[
       {"level":0,"name":"None","cost":1,"ind_cost":1,"flow":1},
       {"level":1,"name":"Patch Web","cost":1,"ind_cost":1,"flow":ε},
    ]},
    {"id":"ScDb", "name":"Patch DB",   "levels":[
       {"level":0,"name":"None","cost":1,"ind_cost":5,"flow":1},
       {"level":1,"name":"Patch DB","cost":1,"ind_cost":5,"flow":ε},
    ]},
    {"id":"N1",   "name":"Firewall",   "levels":[
       {"level":0,"name":"None","cost":1,"ind_cost":1,"flow":1},
       {"level":1,"name":"Firewall","cost":1,"ind_cost":1,"flow":0.7},
    ]},
    {"id":"N2",   "name":"IDS",        "levels":[
       {"level":0,"name":"None","cost":1,"ind_cost":1,"flow":1},
       {"level":1,"name":"IDS","cost":1,"ind_cost":1,"flow":0.01},
    ]},
    {"id":"Ed1",  "name":"Segmentation","levels":[
       {"level":0,"name":"None","cost":1,"ind_cost":1,"flow":1},
       {"level":1,"name":"Segmentation","cost":1,"ind_cost":1,"flow":0.5},
    ]},
    {"id":"Ed2",  "name":"Hardening",  "levels":[
       {"level":0,"name":"None","cost":1,"ind_cost":1,"flow":1},
       {"level":1,"name":"Hardening","cost":1,"ind_cost":1,"flow":0.3},
    ]},
  ],
  "vertices": [{"id": i, "name": str(i)} for i in [0,10,14,18,22,26,30]],
  "edges": [
    {"source":0,  "target":10, "default_flow":1.0, "vulnerability":{"controls":["Ed2"],"adjustment":{}}},
    {"source":0,  "target":10, "default_flow":1.0, "vulnerability":{"controls":["ScW"],"adjustment":{}}},
    {"source":10, "target":14, "default_flow":1.0, "vulnerability":{"controls":["Ed1"],"adjustment":{}}},
    {"source":14, "target":18, "default_flow":1.0, "vulnerability":{"controls":["N1"],"adjustment":{}}},
    {"source":18, "target":22, "default_flow":1.0, "vulnerability":{"controls":["ScS"],"adjustment":{}}},
    {"source":22, "target":26, "default_flow":1.0, "vulnerability":{"controls":["N2"],"adjustment":{}}},
    {"source":26, "target":30, "default_flow":1.0, "vulnerability":{"controls":["ScDb"],"adjustment":{}}},
  ],
  "targets": [30], "targets_inclusion": {}
}

frontier = generate_pareto_frontier(scenario,
                                   max_budget=7,   # e.g. only 7 cost-units
                                   max_indirect_budget=5,
                                   n_points=10)
