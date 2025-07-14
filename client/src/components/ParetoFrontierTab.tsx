// src/components/RightPanelTabs/ParetoFrontierTab.tsx
import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import { ShowChart } from "@mui/icons-material";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Label,
} from "recharts";

import { runPareto } from "../api/Optimise";
import type { ParetoPoint } from "../api/Optimise";
import { getScenarioCostCap } from "../utils/budget";

interface Props {
  model: any;
}

const ParetoFrontierTab: React.FC<Props> = ({ model }) => {
  const theme = useTheme();
  const cap = useMemo(() => getScenarioCostCap(model), [model]);

  // UI state
  const [sweep, setSweep] = useState<"direct" | "indirect">("direct");
  const [directCap, setDirectCap] = useState(cap);
  const [indirectCap, setIndirectCap] = useState(cap);
  const [frontier, setFrontier] = useState<ParetoPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const pts = await runPareto(
        model,
        directCap,
        indirectCap,
        sweep,
        25
      );
      setFrontier(pts);
    } finally {
      setLoading(false);
    }
  };

  const data = frontier.map((p) => ({
    x: sweep === "direct" ? p.cost : p.indirect_cost,
    y: p.risk,
  }));

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      {/* ═════════ Control Card ═════════ */}
      <Card elevation={1}>
        <CardHeader
          avatar={<ShowChart htmlColor={theme.palette.primary.main} />}
          title={
            <Typography variant="h6" color="primary" component="div">
              Generate Pareto Frontier
            </Typography>
          }
        />
        <CardContent>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={sweep}
              onChange={(_, v) => setSweep(v as any)}
            >
              <FormControlLabel
                value="direct"
                control={<Radio color="primary" />}
                label="Cost bound"
              />
              <FormControlLabel
                value="indirect"
                control={<Radio color="primary" />}
                label="Indirect‑cost bound"
              />
            </RadioGroup>
          </FormControl>

          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              {sweep === "direct"
                ? `Direct budget cap: ${directCap}`
                : `Indirect budget cap: ${indirectCap}`}
            </Typography>

            <Slider
              value={sweep === "direct" ? directCap : indirectCap}
              onChange={(_, v) =>
                sweep === "direct"
                  ? setDirectCap(v as number)
                  : setIndirectCap(v as number)
              }
              min={0}
              max={cap}
              step={1}
              valueLabelDisplay="auto"
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "center",   // center the button
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleRun}
          >
            {loading ? "Running…" : "Run Pareto"}
          </Button>
        </CardActions>
      </Card>

      {/* ═════════ Chart Card ═════════ */}
      <Card elevation={1}>
        <CardContent sx={{ height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" dataKey="x" domain={[0, "dataMax"]}>
                <Label
                  value={sweep === "direct" ? "Cost" : "Indirect cost"}
                  position="insideBottom"
                  offset={-10}
                  style={{
                    fontSize: 14,
                    fill: theme.palette.text.secondary,
                  }}
                />
              </XAxis>

              <YAxis
                type="number"
                dataKey="y"
                scale="log"
                domain={["dataMin", "dataMax"]}
              >
                <Label
                  value="Security damage"
                  angle={-90}
                  position="insideLeft"
                  offset={10}
                  style={{
                    fontSize: 14,
                    fill: theme.palette.text.secondary,
                  }}
                />
              </YAxis>

              <Tooltip
                formatter={(v: any) => (v as number).toPrecision(3)}
              />

              <Scatter
                name="Pareto points"
                data={data}
                fill={theme.palette.primary.main}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ParetoFrontierTab;
