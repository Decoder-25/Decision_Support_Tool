// src/components/RightPanelTabs/ControlsTabs.tsx
import { useState } from "react";
import type {  SyntheticEvent } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import OptimizerTab from "./OptimizerTab";
import ManualTab from "./ManualTab";
import ParetoTab from "./ParetoTab";
import ExplanationTab from "./ExplanationTab";

import type { Vertex } from "../VerticesTable";
import type { ControlGroup } from "../ControlGroupsTable";
import type { ControlLevel } from "../ControlLevelsTable";
import type { Edge as EdgeJson } from "../../types/edgesTablesTypes";

interface ControlsTabsProps {
  vertices: Vertex[];
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
  edges: EdgeJson[];
}

export default function ControlsTabs(props: ControlsTabsProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        centered
        sx={{ mb: 2 }}
      >
        <Tab label="Optimizer" />
        <Tab label="Manual" />
        <Tab label="Pareto Frontier" />
        <Tab label="Explanation" />
      </Tabs>

      {tabIndex === 0 && <OptimizerTab {...props} />}
      {tabIndex === 1 && <ManualTab {...props} />}
      {tabIndex === 2 && <ParetoTab {...props} />}
      {tabIndex === 3 && <ExplanationTab />}
    </Box>
  );
}
