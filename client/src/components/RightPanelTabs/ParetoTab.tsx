// src/components/RightPanelTabs/ParetoTab.tsx
import * as React from "react";
import ParetoFrontierTab from "./ParetoFrontierTab";

import type { Vertex }    from "../VerticesTable";
import type { ControlGroup } from "../ControlGroupsTable";
import type { ControlLevel } from "../ControlLevelsTable";
import type { Edge as EdgeJson } from "../../types/edgesTablesTypes";

/** Props driving this tab */
interface Props {
  vertices: Vertex[];
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
  edges: EdgeJson[];
}

/** Exact shape of the optimiser input JSON */
interface LevelJson {
  level: number;
  name: string;
  cost: number;
  ind_cost: number;
  flow: number;
}
interface GroupJson {
  id: string;
  name: string;
  no_control_name: string;
  levels: LevelJson[];
}
interface ScenarioJson {
  name: string;
  control_groups: GroupJson[];
  vertices: { id: number; name: string }[];
  edges: {
    source: number;
    target: number;
    default_flow: number;
    vulnerability: {
      name: string;
      controls: string[];
      adjustment: Record<string, unknown>;
    };
    url: string;
  }[];
  targets: number[];
  targets_inclusion: Record<string, unknown>;
}

/** Build the scenario JSON from the four UI tables */
function buildScenario(p: Props): ScenarioJson {
  const { vertices, controlGroups, controlLevels, edges } = p;

  const groups: GroupJson[] = controlGroups.map((g) => ({
    id: g.id,
    name: g.name,
    no_control_name: "None",
    levels: controlLevels
      .filter((l) => l.groupId === g.id)
      .map((l) => ({
        level: l.level,
        name: l.name,
        cost: l.cost,
        ind_cost: l.indCost,
        flow: l.flow,
      })),
  }));

  const targetId = vertices.length ? vertices[vertices.length - 1].id : 0;

  return {
    name: "builder-scenario",
    control_groups: groups,
    vertices: vertices.map((v) => ({ id: v.id, name: v.name })),
    edges: edges.map((e) => ({
      source: e.source,
      target: e.target,
      default_flow: e.defaultFlow ?? 1,
      vulnerability: {
        name: e.vulnerability.name,
        controls: e.vulnerability.controls,
        adjustment: (e.vulnerability.adjustment ?? {}) as Record<string, unknown>,
      },
      url: e.url ?? "",
    })),
    targets: [targetId],
    targets_inclusion: {},
  };
}

/** Compute the +20% cap */
function calcMaxDirectCost(model: ScenarioJson): number {
  return model.control_groups
    .map((g) => Math.max(...g.levels.map((l) => l.cost)))
    .reduce((sum, max) => sum + max, 0);
}
function calcMaxIndirectCost(model: ScenarioJson): number {
  return model.control_groups
    .map((g) => Math.max(...g.levels.map((l) => l.ind_cost)))
    .reduce((sum, max) => sum + max, 0);
}


/** Cast the imported component to accept two props: model & budgetMax */
type ParetoFrontierProps = {
  model: ScenarioJson;
  maxDirectCap: number;
  maxIndirectCap: number;
};

const TypedParetoFrontier =
  ParetoFrontierTab as unknown as React.FC<ParetoFrontierProps>;

/** The tab itself */
const ParetoTab: React.FC<Props> = (tables) => {
  const scenario  = buildScenario(tables);
  const maxDirectCap = calcMaxDirectCost(scenario);
  const maxIndirectCap = calcMaxIndirectCost(scenario); 
  return <TypedParetoFrontier model={scenario} maxDirectCap={maxDirectCap}
  maxIndirectCap={maxIndirectCap} />;
};

export default ParetoTab;
