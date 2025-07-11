// src/api/scenarioClient.ts
import axios from "axios";

/** Axios instance pointed at your FastAPI scenarios router */
export const scenarioApi = axios.create({
  baseURL: "http://localhost:8000/scenarios",
});

/** A minimal summary returned by GET /scenarios/ */
export interface ScenarioSummary {
  id: string;
  name: string;
}

/** The full scenario shape returned by GET /scenarios/{id} */
export interface Scenario {
  name: string;
  control_groups: {
    id: string;
    name: string;
    no_control_name: string;
    levels: {
      level: number;
      name: string;
      cost: number;
      ind_cost: number;
      flow: number;
    }[];
  }[];
  vertices: { id: number; name: string }[];
  edges: {
    source: number;
    target: number;
    default_flow: number;
    vulnerability: {
      name: string;
      controls: string[];
      adjustment?: Record<string, unknown>;
    };
    url?: string;
  }[];
  targets: number[];
  targets_inclusion: Record<number, number[]>;
}

/** CREATE a new scenario (payload is the full Scenario shape) */
export function createScenario(
  payload: Scenario
): Promise<{ message: string; id: string }> {
  return scenarioApi.post("/", payload).then((res) => res.data);
}

/** LIST all scenarios (id & name) */
export function listScenarios(): Promise<ScenarioSummary[]> {
  return scenarioApi.get<ScenarioSummary[]>("/").then((res) => res.data);
}

/** GET one full scenario by ID */
export function getScenarioById(id: string): Promise<Scenario> {
  return scenarioApi.get<Scenario>(`/${id}`).then((res) => res.data);
}

/** UPDATE an existing scenario (payload is the full Scenario shape) */
export function updateScenario(
  id: string,
  payload: Scenario
): Promise<{ message: string }> {
  return scenarioApi.put(`/${id}`, payload).then((res) => res.data);
}

/** DELETE a scenario by ID */
export function deleteScenario(id: string): Promise<{ message: string }> {
  return scenarioApi.delete(`/${id}`).then((res) => res.data);
}
