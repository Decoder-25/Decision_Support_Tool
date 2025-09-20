# backend/tests/test_performance_real.py
"""
Benchmark the optimiser on the Singhal & Ou (2017) mini case-study
used by Khouzani et al. (2019).  Measures wall-clock runtime only.
"""

import pytest
from backend.services.optimiser import optimise_scenario
from backend.tests.test_case_study_khouzani import _build_case_study


@pytest.mark.benchmark(
    min_rounds=20,          
    warmup=False,           
)
def test_singhal_case_benchmark(benchmark):
    scenario = _build_case_study()
    benchmark(
        optimise_scenario,
        scenario,
        10,     # direct budget
        10,     # indirect budget
    )
