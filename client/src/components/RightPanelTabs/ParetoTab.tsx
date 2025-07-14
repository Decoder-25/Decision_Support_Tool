// src/components/RightPanelTabs/ParetoTab.tsx
import React from "react";
import ParetoFrontierTab from "../ParetoFrontierTab";

import type { Vertex }        from "../VerticesTable";
import type { ControlGroup }  from "../ControlGroupsTable";
import type { ControlLevel }  from "../ControlLevelsTable";
import type { Edge as EdgeJson } from "../../types/edgesTablesTypes";

interface Props {
  vertices: Vertex[];
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
  edges: EdgeJson[];
}

/* turn the four tables the UI keeps into optimiser‑ready JSON */
function buildScenario(p: Props) {
  const { vertices, controlGroups, controlLevels, edges } = p;

  /* ---- control_groups[] ----------------------------------- */
  const groups = controlGroups.map((g) => ({
    id: g.id,
    name: g.name,
    no_control_name: "None",
    levels: controlLevels
      .filter((l) => l.groupId === g.id)
      .map((l) => ({
        level: l.level,
        name:  l.name,
        cost:  l.cost,
        ind_cost: l.indCost,
        flow:  l.flow,
      })),
  }));

  /* ---- vertices / edges ----------------------------------- */
  const targetId = vertices.length ? vertices[vertices.length - 1].id : 0;

  return {
    name: "builder‑scenario",
    control_groups: groups,
    vertices: vertices.map((v) => ({ id: v.id, name: v.name })),
    edges: edges.map((e) => ({
      source: e.source,
      target: e.target,
      default_flow: e.defaultFlow ?? 1,
      vulnerability: {
        name: e.vulnerability.name,
        controls: e.vulnerability.controls,
        adjustment: e.vulnerability.adjustment ?? {},
      },
      url: e.url,
    })),
    targets: [targetId],
    targets_inclusion: {},
  };
}

const ParetoTab: React.FC<Props> = (tables) => {
  const scenario = buildScenario(tables);
  return <ParetoFrontierTab model={scenario} budgetMax={calcMaxDirectCost(scenario)}  />;
};

function calcMaxDirectCost(model: any): number {
  return model.control_groups
              .map((g:any) =>
                     Math.max(...g.levels.map((l:any)=>l.cost)))
              .reduce((a,b)=>a+b, 0);
}

export default ParetoTab;
