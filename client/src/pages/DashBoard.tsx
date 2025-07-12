// src/pages/DashboardPage.tsx
import { Box, Paper, Divider, Chip, Typography, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import OverviewBar from "../components/OverviewBar";
import AttackGraph from "../components/AttackGraph";
import ControlTabs from "../components/RightPanelTabs/ControlsTabs";
import Footer from "../components/Footer";



import { buildControlGroups } from "../utils/buildControlGroups";
import {
  createScenario,
  updateScenario,
  getScenarioById,
  type Scenario,
} from "../api/ScenarioClient";

import { useScenarioBuilder } from "../context/ScenarioBuilderContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { id?: string; fresh?: boolean } };
  const { id: initialId, fresh = false } = location.state ?? {};
  const [currentId, setCurrentId] = useState<string | undefined>(initialId);

  // builder context
  const {
    modelName,
    setModelName, 
    vertices,
    setVertices,
    controlGroups,
    setControlGroups,
    controlLevels,
    setControlLevels,
    edges,
    setEdges,
  } = useScenarioBuilder();

  // load saved scenario when we have an ID
  useEffect(() => {
    if (!currentId || fresh) return;
    getScenarioById(currentId)
      .then((scen) => {
        // 1) Name
        setModelName(scen.name);

        // 2) Vertices + defaultTarget from scen.targets
        setVertices(
          scen.vertices.map((v) => ({
            id: v.id,
            name: v.name,
            defaultTarget:
              Array.isArray(scen.targets) && scen.targets.includes(v.id),
          }))
        );

        // 3) Control groups
        setControlGroups(scen.control_groups);

        // 4) Flatten control levels
        const flatLevels = scen.control_groups.flatMap((grp) =>
          grp.levels.map((lvl) => ({
            groupId: grp.id,
            level: lvl.level,
            name: lvl.name,
            cost: lvl.cost,
            indCost: lvl.ind_cost,
            flow: lvl.flow,
          }))
        );
        setControlLevels(flatLevels);

        // 5) Edges
        setEdges(
          scen.edges.map((e) => ({
            source: e.source,
            target: e.target,
            defaultFlow: e.default_flow,
            vulnerability: {
              name: e.vulnerability.name,
              controls: e.vulnerability.controls,
              adjustment: e.vulnerability.adjustment || {},
            },
            url: e.url,
          }))
        );
      })
      .catch(console.error);
  }, [currentId, fresh, setModelName, setVertices, setControlGroups, setControlLevels, setEdges]);

  // Save or update
  const handleSave = async () => {
    const payload: Scenario = {
      name: modelName,
      control_groups: buildControlGroups(controlGroups, controlLevels),
      vertices: vertices.map((v) => ({ id: v.id, name: v.name })),
      edges: edges.map((e) => ({
        source: e.source,
        target: e.target,
        default_flow: e.defaultFlow,
        vulnerability: {
          name: e.vulnerability.name,
          controls: e.vulnerability.controls,
          adjustment: e.vulnerability.adjustment || {},
        },
        url: e.url,
      })),
      targets: vertices.filter((v) => v.defaultTarget).map((v) => v.id),
      targets_inclusion: {},
    };

    
    try {
      if (currentId) {
        await updateScenario(currentId, payload);
        console.log("Updated", currentId);
      } else {
        const res = await createScenario(payload);
        setCurrentId(res.id);
        console.log("Created", res.id);
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  // Back to Builder, keep id so we continue editing the same scenario
  const handleBack = () => {
    navigate("/page2", {
      state: {
        id: currentId, fresh
      },
    });
  };

  const lastSaved = new Date().toLocaleDateString();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Toolbar />

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
        {/* ── Left column: Attack Graph ─────────────────────────── */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRight: "1px solid #e0e0e0",
            minWidth: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              border: "1px solid #e3e8ef",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#1f2937", fontWeight: 600, fontSize: "1.1rem" }}
              >
                Attack Graph
              </Typography>
              <Chip
                label={`${vertices.length} nodes`}
                size="small"
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1565c0",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
            <Divider sx={{ borderColor: "#e3e8ef" }} />
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", mt: 1, fontSize: "0.875rem" }}
            >
              Visual representation of attack paths and vulnerabilities
            </Typography>
          </Paper>

          <AttackGraph vertices={vertices} edges={edges} />
        </Box>

        {/* ── Right column: Playground ────────────────────────── */}
        <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              border: "1px solid #e3e8ef",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#1f2937", fontWeight: 600, fontSize: "1.1rem" }}
              >
                Playground
              </Typography>
              <Chip
                label={`${controlGroups.length} groups`}
                size="small"
                sx={{
                  backgroundColor: "#f3e8ff",
                  color: "#7c3aed",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
            <Divider sx={{ borderColor: "#e3e8ef" }} />
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", mt: 1, fontSize: "0.875rem" }}
            >
              Configure security controls and optimization parameters
            </Typography>
          </Paper>

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
