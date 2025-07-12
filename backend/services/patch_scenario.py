# backend/services/patch_scenario.py
"""
Utilities that *repair* a scenario dict so it is always solvable
by the optimiser (adds level‑0, fixes vertices format, etc.).
"""

from typing import Any, Dict, List
import copy
import logging

log = logging.getLogger(__name__)


def ensure_level0(scenario: Dict[str, Any]) -> Dict[str, Any]:
    """
    Guarantee every control_group has a level 0 option.
    If it's missing, insert:
        { level:0 , name:"None", cost:0, ind_cost:0, flow:1 }
    Keeps levels sorted by `level`.
    """
    s = copy.deepcopy(scenario)          # DON'T mutate caller’s dict

    for g in s.get("control_groups", []):
        if any(lvl.get("level") == 0 for lvl in g["levels"]):
            continue                        # already has level 0

        log.debug("Adding level‑0 to group %s", g["id"])
        g["levels"].insert(0, {
            "level": 0,
            "name":  g.get("no_control_name", "None") or "None",
            "cost":  0.0,
            "ind_cost": 0.0,
            "flow":  1.0
        })
        # make sure levels are sorted
        g["levels"].sort(key=lambda l: l["level"])

    return s
