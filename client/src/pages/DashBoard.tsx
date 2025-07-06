// src/pages/DashboardPage.tsx
import React from "react";
import {
  Box,
  Paper,
  Divider,
  Chip,
  Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import OverviewBar from "../components/OverviewBar";
import AttackGraph from "../components/AttackGraph";
// import InputFields from "../components/InputFields";  // no longer needed
import ControlTabs from "../components/RightPanelTabs/ControlsTabs";
import Footer from "../components/Footer";

import type { Vertex } from "../components/VerticesTable";
import type { ControlGroup } from "../components/ControlGroupsTable";
import type { ControlLevel } from "../components/ControlLevelsTable";
import type { Edge as EdgeJson } from "../types/edgesTablesTypes";
import { createScenario, type ScenarioPayload } from "../components/api/SaveToDB";

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
  const state = (location.state ?? {}) as Partial<ScenarioState>;

  const {
    modelName = "Untitled Model",
    vertices = [],
    controlGroups = [],
    controlLevels = [],
    edges = [],
  } = state;

  const lastSaved = new Date().toLocaleDateString();

  const handleSave = async () => {
    const payload: ScenarioPayload = {
      name: modelName,
      control_groups: controlGroups.map(g => ({
        id: g.id,
        name: g.name,
        no_control_name: g.no_control_name,
        levels: g.levels.map(l => ({
          level: l.level,
          name: l.name,
          cost: l.cost,
          ind_cost: l.ind_cost,
          flow: l.flow,
        })),
      })),
      vertices: vertices.map(v => ({ id: v.id, name: v.name })),
      edges: edges.map(e => ({
        source: e.source,
        target: e.target,
        default_flow: e.defaultFlow,
        vulnerability: {
          name: e.vulnerability.name,
          controls: e.vulnerability.controls,
          // no adjustment for now, or add if you need it
        },
        url: e.url,
      })),
      // 3) use your defaultTarget flags:
      targets: vertices.filter(v => v.defaultTarget).map(v => v.id),
      // 4) if you need per‐target inclusion, build it here; otherwise send empty:
      targets_inclusion: {},
    };
    try {
      console.log("staring to create scenario");
      
      const created = await createScenario(payload);
      console.log("scenario created:", created);
      
      
    } catch (err) {
      console.error("failed to save scenario:", err);
      // you might show a toast or dialog here
    }
  
    console.log("Payload", payload);
  };
  const handleBack = () => {
    navigate("/page2", { state: { modelName, vertices, controlGroups, controlLevels, edges } });
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <DashboardHeader />

      <Box sx={{ flex: "0 0 auto", p: 2, backgroundColor: "#fafafa" }}>
        <OverviewBar
          modelName={modelName}
          lastSaved={lastSaved}
          onSave={handleSave}
          onBack={handleBack}
        />
      </Box>

      <Box sx={{ flex: 1, display: "flex", bgcolor: "#f0f4f8" }}>
        {/* ── Left column ─────────────────────────── */}
        <Box sx={{ flex: 1, p: 2, borderRight: "1px solid #e0e0e0", minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #e3e8ef" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6" sx={{ color: "#1f2937", fontWeight: 600, fontSize: "1.1rem" }}>
                Attack Graph
              </Typography>
              <Chip
                label={`${vertices.length} nodes`}
                size="small"
                sx={{ backgroundColor: "#e3f2fd", color: "#1565c0", fontWeight: 500, fontSize: "0.75rem" }}
              />
            </Box>
            <Divider sx={{ borderColor: "#e3e8ef" }} />
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1, fontSize: "0.875rem" }}>
              Visual representation of attack paths and vulnerabilities
            </Typography>
          </Paper>

          <AttackGraph vertices={vertices} edges={edges} />
        </Box>

        {/* ── Right column ────────────────────────── */}
        <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #e3e8ef" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6" sx={{ color: "#1f2937", fontWeight: 600, fontSize: "1.1rem" }}>
                Playground
              </Typography>
              <Chip
                label={`${controlGroups.length} groups`}
                size="small"
                sx={{ backgroundColor: "#f3e8ff", color: "#7c3aed", fontWeight: 500, fontSize: "0.75rem" }}
              />
            </Box>
            <Divider sx={{ borderColor: "#e3e8ef" }} />
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1, fontSize: "0.875rem" }}>
              Configure security controls and optimization parameters
            </Typography>
          </Paper>

          {/* ← Here’s your new tabs component! */}
          <ControlTabs
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
