// src/types/edgesTablesTypes.ts

import type { Dispatch, SetStateAction } from "react";

export interface Vertex {
  id: number;
  name: string;
}

export interface ControlGroup {
  id: string;
  name: string;
}

export interface VulnerabilityAdjustment {
  [key: string]: unknown;
}

export interface Vulnerability {
  name: string;
  controls: string[];
  adjustment?: VulnerabilityAdjustment;
}

export interface Edge {
  source: number;
  target: number;
  defaultFlow: number;
  vulnerability: Vulnerability;
  url?: string;
}

export interface Props {
  vertices: Vertex[];
  controlGroups: ControlGroup[];
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}
