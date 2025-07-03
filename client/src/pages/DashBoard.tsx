// src/pages/DashboardPage.tsx
import React from "react";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import OverviewBar from "../components/OverviewBar";
import AttackGraph from "../components/AttackGraph";
import InputFields from "../components/InputFields";
import Footer from "../components/Footer";

import type { Vertex } from "../components/VerticesTable";
import type { ControlGroup } from "../components/ControlGroupsTable";
import type { ControlLevel } from "../components/ControlLevelsTable";
import type { Edge as EdgeJson } from "../types/edgesTablesTypes";

// 1) Define a proper state shape
interface ScenarioState {
  modelName: string;
  vertices: Vertex[];
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
  edges: EdgeJson[];
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // 2) Type‑assert location.state safely
  const state = (location.state ?? {}) as Partial<ScenarioState>;

  // 3) Provide defaults if any piece is missing
  const {
    modelName = "Untitled Model",
    vertices = [],
    controlGroups = [],
    controlLevels = [],
    edges = [],
  } = state;

  const lastSaved = new Date().toLocaleDateString();

  const handleSave = () => {
    // call your save‑model API here...
    console.log("Saving model", modelName, {
      vertices,
      controlGroups,
      controlLevels,
      edges,
    });
  };

  const handleBack = () => {
    // send user back to builder, preserving the same state
    navigate("/page2", { state: { modelName, vertices, controlGroups, controlLevels, edges } });
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Old header first */}
      <DashboardHeader />

      {/* Overview bar next */}
      <Box sx={{ flex: "0 0 auto", p: 2, backgroundColor: "#fafafa" }}>
        <OverviewBar
          modelName={modelName}
          lastSaved={lastSaved}
          onSave={handleSave}
          onBack={handleBack}
        />
      </Box>

      {/* Main two‑column view */}
      <Box sx={{
          flex: 1,
          display: "flex",
          bgcolor: "#f0f4f8",
        }}>
        {/* Attack graph */}
        <Box sx={{ flex: 1, p: 2, borderRight: "1px solid #e0e0e0", minWidth: 0 }}>
          <AttackGraph vertices={vertices} edges={edges} />
        </Box>

        {/* Controls playground */}
        <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
          <InputFields
            vertices={vertices}
            controlGroups={controlGroups}
            controlLevels={controlLevels}
            edges={edges}
          />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
