// src/api/optimise.ts
import axios from "axios";

/* ------------------------------------------------------------------ */
/*  Axios instance – points at FastAPI `/scenarios` prefix            */
/* ------------------------------------------------------------------ */
const optimiseApi = axios.create({
  baseURL: "http://localhost:8000/scenarios",
});

/* ------------------------------------------------------------------ */
/*  Types for request + response                                      */
/* ------------------------------------------------------------------ */
export interface PlaygroundOptimiseBody {
  /* full Scenario payload */     scenario: any;      // you can type this stricter later
  /* optimisation params  */      budget: number;
                                  indirect_budget: number;
                                  targets?: number[];
}

export interface SavedOptimiseBody {
  budget: number;
  indirect_budget: number;
  targets?: number[];
}

export interface APIOptimiseResponse {
  status: string;
  selected_controls: Array<{
    group_id: string;
    group_name: string;
    level: number;
    level_name: string;
    cost: number;
    ind_cost: number;
    flow: number;
  }>;
  total_cost: number;
  total_indirect_cost: number;
  max_flow_to_targets: number;
}

/* ------------------------------------------------------------------ */
/*  Helper functions                                                  */
/* ------------------------------------------------------------------ */
export async function playgroundOptimise(
  body: PlaygroundOptimiseBody
): Promise<APIOptimiseResponse> {
  const res = await optimiseApi.post("/optimise", body);
  return res.data;
}

export async function optimiseSavedScenario(
  scenarioId: string,
  body: SavedOptimiseBody
): Promise<APIOptimiseResponse> {
  const res = await optimiseApi.post(`/${scenarioId}/optimise`, body);
  return res.data;
}
