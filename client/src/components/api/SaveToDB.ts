// src/api/scenarioClient.ts
import axios from 'axios';

export const scenarioApi = axios.create({
  baseURL: 'http://localhost:8000/scenarios',
});

export interface ScenarioPayload {
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
      // if your backend expects `adjustment`, include it here
      adjustment?: Record<string, unknown>;
    };
    url?: string;
  }[];
  targets: number[];
  targets_inclusion: Record<string, number[]>;
}
export function createScenario(
    payload: ScenarioPayload
  ): Promise<{ id: string; name: string }> {
    return scenarioApi.post("/", payload).then((res) => res.data);
}
