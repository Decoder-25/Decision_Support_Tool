// src/components/RightPanelTabs/ManualTab.tsx

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  type SelectChangeEvent,
} from "@mui/material";
import { Settings, Paid, Savings, Speed } from "@mui/icons-material";

import type { ControlGroup } from "../ControlGroupsTable";
import type { ControlLevel } from "../ControlLevelsTable";

interface ManualTabProps {
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
}

// selections[g.id] is either a level number or the empty string (meaning “None”)
type SelectionValue = number | "";
type SelectionsMap = Record<string, SelectionValue>;

export default function ManualTab({
  controlGroups,
  controlLevels,
}: ManualTabProps) {
  const [selections, setSelections] = useState<SelectionsMap>({});

  // initialize each group to level 0 on mount or when groups change
  useEffect(() => {
    const init: SelectionsMap = {};
    controlGroups.forEach((g) => {
      init[g.id] = 0;
    });
    setSelections(init);
  }, [controlGroups]);

  // compute totals when any selection changes
  const { totalCost, totalIndirect, totalFlow } = useMemo(() => {
    let cost = 0,
      ind = 0,
      flow = 0;

    for (const g of controlGroups) {
      const lvl = selections[g.id] === "" ? -1 : selections[g.id];
      const info = controlLevels.find(
        (c) => c.groupId === g.id && c.level === lvl
      );
      if (info) {
        cost += info.cost;
        ind += info.indCost;
        flow += info.flow;
      }
    }
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

        {/* Dropdowns for each group */}
        {controlGroups.map((g) => (
          <Box key={g.id} sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{g.name}</InputLabel>
              <Select
                value={selections[g.id] ?? ""}
                label={g.name}
                onChange={(e: SelectChangeEvent<SelectionValue>) => {
                  const val = e.target.value;
                  setSelections((prev) => ({
                    ...prev,
                    [g.id]: val,
                  }));
                }}
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
      </Paper>
    </Box>
  );
}
