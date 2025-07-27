// src/api/Optimise.ts

import axios from "axios";
import type { AxiosResponse } from "axios";

const optimiseApi = axios.create({
  baseURL: "http://localhost:8000/scenarios",
});

/** 
 * The shape of the JSON payload your FastAPI expects. 
 * Expand this as needed to exactly match your backend schema. 
 */
export interface ScenarioJson {
  name?: string;
  control_groups: Array<{
    id: string;
    name: string;
    no_control_name: string;
    levels: Array<{
      level: number;
      name: string;
      cost: number;
      ind_cost: number;
      flow: number;
    }>;
  }>;
  vertices: Array<{ id: number; name: string }>;
  edges: Array<{
    source: number;
    target: number;
    default_flow: number;
    vulnerability: {
      name: string;
      controls: string[];
      adjustment: Record<string, unknown>;
    };
    url?: string;
  }>;
  targets?: number[];
  targets_inclusion?: Record<string, unknown>;
  /** allow other backend-specific fields without drifting back to `any` */
  [key: string]: unknown;
}

/** Payload for the “playground” optimisation endpoint */
export interface PlaygroundOptimiseBody {
  scenario: ScenarioJson;
  budget: number;
  indirect_budget: number;
  targets?: number[];
}

/** Payload for re-optimising a saved scenario */
export interface SavedOptimiseBody {
  budget: number;
  indirect_budget: number;
  targets?: number[];
}

/** What the optimiser returns */
export interface APIOptimiseResponse {
  status: "ok" | "error";
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

/** Payload for the ε-constraint (Pareto) endpoint */
export interface ParetoBody {
  scenario: ScenarioJson;
  max_budget: number;
  max_indirect_budget: number;
  points?: number;
}

/** One point on the returned Pareto frontier */
export interface ParetoPoint {
  cost: number;
  indirect_cost: number;
  risk: number;
  selected_controls: APIOptimiseResponse["selected_controls"];
}

/** Response envelope for the Pareto endpoint */
export interface APIParetoResponse {
  status: "ok";
  frontier: ParetoPoint[];
}

/** ─── Playground optimise ───────────────────────────────────── */
export async function playgroundOptimise(
  body: PlaygroundOptimiseBody
): Promise<APIOptimiseResponse> {
  const res = await optimiseApi.post<APIOptimiseResponse>("/optimise", body);
  return res.data;
}

/** ─── Baseline risk (zero budget) ──────────────────────────── */
export async function playgroundBaselineRisk(
  scenario: ScenarioJson
): Promise<number> {
  const body = {
    scenario,
    budget: 0,
    indirect_budget: 0,
    targets: Array.isArray(scenario.targets) ? scenario.targets : [],
  };
  const res = await optimiseApi.post<APIOptimiseResponse>("/optimise", body);
  return res.data.max_flow_to_targets;
}

/** ─── Saved scenario optimise ───────────────────────────────── */
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

/** ─── Pareto frontier ──────────────────────────────────────── */
export async function runPareto(
  scenario: ScenarioJson,
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

  return res.data.frontier;
}
