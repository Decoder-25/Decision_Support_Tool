"""
Monte-Carlo resilience simulation.
Given a solved optimisation scenario (the dict returned by optimise_scenario)
estimate how many *independent* attack attempts the organisation can
withstand before at least one attack succeeds.

Assumptions
-----------
• Attacks are memory-less and independent.
• Success probability per attack   p_s  = max_flow_to_targets
  (already computed by the optimiser).
• Stopping condition: first success ⇒ breach.
  => Number of attacks ~ Geometric(p_s).

The geometric distribution has:
  E[N]  = 1 / p_s
  Var   = (1 - p_s) / p_s**2
  95 % confidence ≈ ±1.96·sqrt(Var / runs)

If you want a *full* attack-graph simulation just swap in your own
`custom_run_once()` that walks the graph; the wrapper stays the same.
"""

from __future__ import annotations
import math, random
from typing import Dict, Any, Tuple, List


def _sample_geometric(p: float) -> int:
    """Return number of Bernoulli trials until first success (k ≥ 1)."""
    # inverse-CDF method
    u = random.random()
    return math.ceil(math.log(1 - u) / math.log(1 - p))


def estimate_attacks_before_breach(result_dict: Dict[str, Any],
                                   n_runs: int = 10_000
                                   ) -> Dict[str, float]:
    """
    Parameters
    ----------
    result_dict : output of optimise_scenario()
                  must contain key 'max_flow_to_targets'
    n_runs      : Monte-Carlo repetitions for CI

    Returns
    -------
    dict with mean, stdev, ci_low, ci_high
    """
    p = result_dict["max_flow_to_targets"]
    if p <= 0:
        # mathematically zero risk ⇒ infinite expected attacks;
        # cap at a very large number to avoid div/0
        return {"mean": float("inf"), "stdev": 0.0,
                "ci_low": float("inf"), "ci_high": float("inf")}

    samples: List[int] = [_sample_geometric(p) for _ in range(n_runs)]
    mean = sum(samples) / n_runs
    # unbiased sample variance
    var  = sum((x - mean) ** 2 for x in samples) / (n_runs - 1)
    stdev = math.sqrt(var)
    ci_half = 1.96 * stdev / math.sqrt(n_runs)
    return {
        "mean":   mean,
        "stdev":  stdev,
        "ci_low": mean - ci_half,
        "ci_high": mean + ci_half,
    }
