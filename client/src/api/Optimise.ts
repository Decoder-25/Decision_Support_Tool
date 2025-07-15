/* ------------------------------------------------------------------ */
/*  Axios helper – FastAPI lives at http://localhost:8000/scenarios   */
/* ------------------------------------------------------------------ */
import axios from "axios";
import type { AxiosResponse } from "axios"; 

const optimiseApi = axios.create({
  baseURL: "http://localhost:8000/scenarios",
});

/* ------------------------------------------------------------------ */
/*  TYPE DEFS                                                         */
/* ------------------------------------------------------------------ */
export interface PlaygroundOptimiseBody {
  scenario: any;            // tighten later if you like
  budget: number;
  indirect_budget: number;
  targets?: number[];
}

export interface SavedOptimiseBody {
  budget: number;
  indirect_budget: number;
  targets?: number[];
}

export interface APIOptimiseResponse {
  status: "ok" | "error";
  selected_controls: {
    group_id: string;
    group_name: string;
    level: number;
    level_name: string;
    cost: number;
    ind_cost: number;
    flow: number;
  }[];
  total_cost: number;
  total_indirect_cost: number;
  max_flow_to_targets: number;
}

/* ---- Pareto specific --------------------------------------------- */
export interface ParetoBody {
  scenario: any;
  max_budget: number;            /* ε‑constraint upper bound */
  max_indirect_budget: number;
  points?: number;               /* default = 25 */
}

/* This is what FastAPI returns for each efficient point */
export interface ParetoPoint {
  cost: number;
  indirect_cost: number;
  risk: number;
  selected_controls: APIOptimiseResponse["selected_controls"];
}

export interface APIParetoResponse {
  status: "ok";
  frontier: ParetoPoint[];
}

/* ------------------------------------------------------------------ */
/*  CALL WRAPPERS                                                     */
/* ------------------------------------------------------------------ */
export async function playgroundOptimise(
  body: PlaygroundOptimiseBody
): Promise<APIOptimiseResponse> {
  const res = await optimiseApi.post<APIOptimiseResponse>("/optimise", body);
  return res.data;
}

/* ------------- baseline helper ---------------------------------- */
/** Ask the optimiser to run with **zero** budget so we can compare
    the “no controls” risk with the chosen portfolio.                */
    export async function playgroundBaselineRisk(scenario: any): Promise<number> {
      const body = {
        scenario,
        budget: 0,
        indirect_budget: 0,
        targets: scenario.targets ?? [],
      };
      const res = await optimiseApi.post<APIOptimiseResponse>("/optimise", body);
      return res.data.max_flow_to_targets;
    }
    

export async function optimiseSavedScenario(
  scenarioId: string,
  body: SavedOptimiseBody
): Promise<APIOptimiseResponse> {
  const res = await optimiseApi.post<APIOptimiseResponse>(
    `/${scenarioId}/optimise`,
    body
  );
  return res.data;
}

/* ---- Pareto helper ------------------------------------------------ */
export async function runPareto(
  scenario: any,
  directCap = 25,
  indirectCap = 1e9,
  sweep: "direct" | "indirect" = "direct",
  points = 25
): Promise<ParetoPoint[]> {
  const body: ParetoBody = {
    scenario,
    max_budget:          sweep === "direct"   ? directCap   : 1e9,
    max_indirect_budget: sweep === "indirect" ? indirectCap : 1e9,
    points,
  };

  const res: AxiosResponse<APIParetoResponse> =
    await optimiseApi.post("/pareto", body);

  return res.data.frontier;      // just the array of points
}
