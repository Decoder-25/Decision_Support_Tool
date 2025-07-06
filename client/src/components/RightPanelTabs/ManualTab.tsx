// src/components/RightPanelTabs/ManualTab.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { Settings, Paid, Savings, Speed, Shield } from "@mui/icons-material";

import type { ControlGroup } from "../ControlGroupsTable";
import type { ControlLevel } from "../ControlLevelsTable";

interface ManualTabProps {
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
}

export default function ManualTab({
  controlGroups,
  controlLevels,
}: ManualTabProps) {
  // track each group’s selected level
  const [selections, setSelections] = useState<Record<string, number | " ">>({});

  // initialize to level 0 for each group
  useEffect(() => {
    const init: Record<string, number> = {};
    controlGroups.forEach((g) => {
      init[g.id] = 0;
    });
    setSelections(init);
  }, [controlGroups]);

  // compute totals when selections change
  const { totalCost, totalIndirect, totalFlow } = useMemo(() => {
    let cost = 0,
      ind = 0,
      flow = 0;
    controlGroups.forEach((g) => {
      const lvl = selections[g.id] ?? 0;
      const info = controlLevels.find(
        (c) => c.groupId === g.id && c.level === lvl
      );
      if (info) {
        cost += info.cost;
        ind += info.indCost;
        flow += info.flow;
      }
    });
    return { totalCost: cost, totalIndirect: ind, totalFlow: flow };
  }, [selections, controlGroups, controlLevels]);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: "#f9fafb",
          border: "1px solid #e3e8ef",
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Settings sx={{ color: "#2563eb", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#2563eb" }}>
            Manual Configuration
          </Typography>
        </Box>

        {/* Dropdowns */}

        {controlGroups.map((g) => (
        <Box key={g.id} sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
            <InputLabel>{g.name}</InputLabel>
            <Select
                value={selections[g.id] ?? ""} // "" represents None selected
                label={g.name}
                onChange={(e) =>
                setSelections((prev) => ({
                    ...prev,
                    [g.id]: e.target.value === "" ? undefined : (e.target.value as number),
                }))
                }
                sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2563eb",
                },
                }}
            >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {controlLevels
          .filter((c) => c.groupId === g.id)
          .map((c) => (
            <MenuItem key={c.level} value={c.level}>
              {c.name} (Cost: {c.cost}, Indirect: {c.indCost})
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  </Box>
))}

      </Paper>

      {/* Results */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: "#fff",
          border: "1px solid #e3e8ef",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            fontWeight: 600,
            color: "#059669",
          }}
        >
          <Paid sx={{ mr: 1 }} />
          Total Cost: {totalCost}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="subtitle1"
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            fontWeight: 600,
            color: "#ca8a04",
          }}
        >
          <Savings sx={{ mr: 1 }} />
          Total Indirect: {totalIndirect}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="subtitle1"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            color: "#db2777",
          }}
        >
          <Speed sx={{ mr: 1 }} />
          Flow Score: {totalFlow.toFixed(3)}
        </Typography>

        <Divider sx={{ my: 2 }} />

      
      </Paper>
    </Box>
  );
}
