import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ExpandMore as ExpandIcon,
  Paid,
  Savings,
  Shield,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";

import { useOptimiser } from "../../context/OptimiserContext";
import { useScenarioBuilder } from "../../context/ScenarioBuilderContext";
import {
  playgroundBaselineRisk,
  playgroundOptimise,
  type ScenarioJson,
} from "../../api/Optimise";
import { buildControlGroups } from "../../utils/buildControlGroups";

export default function ExplanationTab() {
  const { result, setBaseline: setCtxBaseline } = useOptimiser();
  const { vertices, controlGroups, controlLevels, edges } =
    useScenarioBuilder();

  // Memoize the full ScenarioJson
  const scenario = useMemo<ScenarioJson>(() => ({
    name: "builder",
    control_groups: buildControlGroups(controlGroups, controlLevels),
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
    })),
    targets: vertices.filter((v) => v.defaultTarget).map((v) => v.id),
    targets_inclusion: {},
  }), [vertices, controlGroups, controlLevels, edges]);

  const [baseline, setBaseline] = useState<number | null>(null);
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!result) return;

    (async () => {
      setBusy(true);

      // 1) compute zero‐budget baseline
      const baseRisk = await playgroundBaselineRisk(scenario);
      setBaseline(baseRisk);
      setCtxBaseline(baseRisk);

      // 2) for each chosen control, zero out its levels and re‐optimise
      type JobKey = `${string}-${number}`;
      const jobs = result.selected_controls.map(async (ctrl) => {
        const scen = structuredClone(scenario) as ScenarioJson;

        const g = scen.control_groups.find((g) => g.id === ctrl.group_id);
        if (g) g.levels = g.levels.filter((l) => l.level === 0);

        const res = await playgroundOptimise({
          scenario: scen,
          budget: 1e9,
          indirect_budget: 1e9,
          targets: scen.targets,
        });
        return [`${ctrl.group_id}-${ctrl.level}` as JobKey, res.max_flow_to_targets] as const;
      });

      const entries = await Promise.all(jobs);
      setDeltas(Object.fromEntries(entries));
      setBusy(false);
    })();
  }, [result, scenario, setCtxBaseline]);

  if (!result) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Run the optimiser first, then switch back here.</Typography>
      </Box>
    );
  }
  if (busy || baseline === null) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const globalImprovement =
    ((baseline - result.max_flow_to_targets) / baseline) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Why were these controls selected?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        The optimiser picked <strong>{result.selected_controls.length}</strong>{" "}
        control{result.selected_controls.length !== 1 && "s"}, cutting the max
        flow from <strong>{baseline.toFixed(2)}</strong> to{" "}
        <strong>{result.max_flow_to_targets.toFixed(2)}</strong>{" "}
        (<strong>{globalImprovement.toFixed(0)}% improvement</strong>).
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }}>
        <Chip icon={<Paid />} label={`Cost ${result.total_cost}`} size="small" sx={{ bgcolor: "#e0f2fe", color: "#0284c7" }} />
        <Chip icon={<Savings />} label={`Indirect ${result.total_indirect_cost}`} size="small" sx={{ bgcolor: "#fef9c3", color: "#d97706" }} />
      </Stack>

      {result.selected_controls.map((ctrl) => {
        const key = `${ctrl.group_id}-${ctrl.level}`;
        const offRisk = deltas[key] ?? baseline!;
        const delta = offRisk - result.max_flow_to_targets;
        const factor = offRisk / result.max_flow_to_targets;
        const hits = edges.filter((e) =>
          Object.keys(e.vulnerability?.controls ?? {}).includes(ctrl.group_id)
        ).length;
        const efficiency = ctrl.cost > 0 ? delta / ctrl.cost : undefined;

        return (
          <Accordion key={key} disableGutters sx={{ mb: 1, borderRadius: 2, "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Shield sx={{ mr: 1, color: "#059669" }} />
              <Typography>
                {ctrl.group_name} – {ctrl.level_name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  <Paid fontSize="inherit" sx={{ mr: 0.5 }} />
                  Cost {ctrl.cost}
                </Typography>
                <Typography variant="body2">
                  <TrendingDown fontSize="inherit" sx={{ mr: 0.5 }} />
                  Flow now {ctrl.flow}
                </Typography>
                <Tooltip title="If you removed this control">
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                    <TrendingUp fontSize="inherit" sx={{ mr: 0.5, color: "#dc2626" }} />
                    Risk would jump to {offRisk.toFixed(2)} (≈ {factor.toFixed(1)}×, Δ {delta.toFixed(2)})
                  </Typography>
                </Tooltip>
                <Typography variant="body2">
                  • Blocks <strong>{hits}</strong> attack path{hits !== 1 && "s"}
                </Typography>
                {efficiency !== undefined && (
                  <Chip
                    size="small"
                    label={`Δ ${delta.toFixed(2)} / $${ctrl.cost} = ${efficiency.toFixed(2)}`}
                    sx={{ bgcolor: "#f0fdfa", color: "#047857" }}
                  />
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
