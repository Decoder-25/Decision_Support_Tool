// src/components/RightPanelTabs/OptimizerTab.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Slider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  AttachMoney,
  Savings,
  TrendingUp,
  Paid,
  Speed,
  Shield,
  Security,
  Settings,
} from "@mui/icons-material";

import type { Vertex } from "../VerticesTable";
import type { ControlGroup } from "../ControlGroupsTable";
import type { ControlLevel } from "../ControlLevelsTable";
import type { Edge as EdgeJson } from "../../types/edgesTablesTypes";

import { playgroundOptimise } from "../../api/Optimise";

interface APIOptimiseResponse {
  status: string;
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

interface OptimizerTabProps {
  // If you have a saved scenario, pass its ID here:
  scenarioId?: string;
  vertices: Vertex[];
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
  edges: EdgeJson[];
}

const OptimizerTab: React.FC<OptimizerTabProps> = ({
  scenarioId,
  vertices,
  controlGroups,
  controlLevels,
  edges,
}) => {
  // console.log("Scenario ID:", scenarioId);
  // console.log("Vertices:", vertices);
  //console.log("Control Groups:", controlGroups);
  console.log("Control Levels:", controlLevels);
  // console.log("Edges:", edges);

  const maxDirectBudget = useMemo(() => {
    // group levels by groupId, then sum each group’s max cost
    const byGroup = controlLevels.reduce<Record<string, number>>((acc, lvl) => {
      acc[lvl.groupId] = Math.max(acc[lvl.groupId] || 0, lvl.cost);
      return acc;
    }, {});
    return Object.values(byGroup).reduce((sum, c) => sum + c, 0);
  }, [controlLevels]);

  const maxIndirectBudget = useMemo(() => {
    const byGroup = controlLevels.reduce<Record<string, number>>((acc, lvl) => {
      acc[lvl.groupId] = Math.max(acc[lvl.groupId] || 0, lvl.indCost);
      return acc;
    }, {});
    return Object.values(byGroup).reduce((sum, c) => sum + c, 0);
  }, [controlLevels]);

  const [directBudget, setDirectBudget] = useState(0);
  const [indirectBudget, setIndirectBudget] = useState(0);
  const [selectedTargets, setSelectedTargets] = useState<number[]>(() =>
    vertices.filter((v) => v.defaultTarget).map((v) => v.id)
  );
  const [optimising, setOptimising] = useState(false);
  const [result, setResult] = useState<APIOptimiseResponse | null>(null);

  /* ----------------- Optimise button ----------------- */
  const handleOptimise = async () => {
    setOptimising(true);
    console.log(controlLevels);
    /* build exactly the payload the backend expects */
    const payload = {
      scenario: {
        name: "playground",

        /* attach the right levels to each group */
        control_groups: controlGroups.map((g) => ({
          id: g.id,
          name: g.name,
          no_control_name: g.no_control_name,

          /* pick ONLY the levels that belong to this group */
          levels: controlLevels
            .filter((l) => l.groupId === g.id) // ◀─ match on id
            .map((l) => ({
              level: l.level,
              name: l.name,
              cost: l.cost,
              ind_cost: l.indCost,
              flow: l.flow,
            })),
        })),

        vertices: vertices.map((v) => ({ id: v.id, name: v.name })),

        edges: edges.map((e) => ({
          source: e.source,
          target: e.target,
          default_flow: e.defaultFlow ?? (e as any).defaultFlow ?? 1,
          vulnerability: {
            name: e.vulnerability.name,
            controls: e.vulnerability.controls, // ["c1", "c2", …]
            adjustment: (e.vulnerability as any).adjustment ?? {},
          },
          url: e.url,
        })),

        targets: selectedTargets,
        targets_inclusion: {},
      },

      /* optimisation parameters */
      budget: directBudget,
      indirect_budget: indirectBudget,
      targets: selectedTargets,
    };
    console.log(payload);

    setOptimising(false);

    console.log("▶️  Optimise payload", payload);

    try {
      const res = await playgroundOptimise(payload);
      console.log("✅ Optimise response", res);
      setResult(res);
    } catch (err) {
      console.error("❌ Optimise failed", err);
      // optional: show snackbar / toast to the user
    } finally {
      setOptimising(false);
    }
  };

  return (
    <Box>
      {/* ─── Inputs ─── */}
      <Paper
        sx={{ p: 3, mb: 3, bgcolor: "#f9fafb", border: "1px solid #e3e8ef" }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            color: "#2563eb",
          }}
        >
          <Settings sx={{ mr: 1 }} /> Configuration Inputs
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Direct Budget */}
          <Box>
            <Typography gutterBottom>
              <AttachMoney sx={{ mr: 0.5 }} />
              Direct Budget: {directBudget}
            </Typography>
            <Slider
              value={directBudget}
              onChange={(_, v) => setDirectBudget(v as number)}
              min={0}
              max={maxDirectBudget}
              step={1}
              valueLabelDisplay="auto"
              sx={{ color: "#2563eb" }}
            />
          </Box>

          {/* Indirect Budget */}
          <Box>
            <Typography gutterBottom>
              <Savings sx={{ mr: 0.5 }} />
              Indirect Budget: {indirectBudget}
            </Typography>
            <Slider
              value={indirectBudget}
              onChange={(_, v) => setIndirectBudget(v as number)}
              min={0}
              max={maxIndirectBudget}
              step={1}
              valueLabelDisplay="auto"
              sx={{ color: "#f59e0b" }}
            />
          </Box>

          {/* Targets Multi‑Select */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Targets</InputLabel>
            <Select
              multiple
              value={selectedTargets}
              label="Targets"
              onChange={(e) => setSelectedTargets(e.target.value as number[])}
            >
              {vertices.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Optimise Button */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleOptimise}
              disabled={false}
              sx={{ backgroundColor: "#2563eb", fontWeight: "bold" }}
            >
              {optimising ? "Optimising..." : "Optimise"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ─── Results ─── */}
      {result && (
        <Paper sx={{ p: 3, bgcolor: "#fff", border: "1px solid #e3e8ef" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              color: "#059669",
            }}
          >
            <Security sx={{ mr: 1 }} /> Optimiser Result
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <Chip
              icon={<Paid />}
              label={`Total Cost: ${result.total_cost}`}
              sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9" }}
            />
            <Chip
              icon={<Savings />}
              label={`Indirect Cost: ${result.total_indirect_cost}`}
              sx={{ bgcolor: "#fef9c3", color: "#ca8a04" }}
            />
            <Chip
              icon={<Speed />}
              label={`Max Flow: ${result.max_flow_to_targets.toFixed(3)}`}
              sx={{ bgcolor: "#fce7f3", color: "#db2777" }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Shield sx={{ mr: 1 }} /> Selected Controls
          </Typography>
          <List dense>
            {result.selected_controls.map((ctrl) => (
              <ListItem key={`${ctrl.group_id}-${ctrl.level}`} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ color: "#059669" }}>
                  <Shield fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`${ctrl.group_name} – ${ctrl.level_name}`}
                  secondary={`Cost: ${ctrl.cost}, Indirect: ${ctrl.ind_cost}, Flow: ${ctrl.flow}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default OptimizerTab;
