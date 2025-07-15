// src/components/RightPanelTabs/ExplanationTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Stack, Chip, Tooltip, CircularProgress
} from "@mui/material";
import {
  Shield, Paid, Savings, ExpandMore as ExpandIcon,
  TrendingDown, TrendingUp
} from "@mui/icons-material";

import { useOptimiser }          from "../../context/OptimiserContext";
import { playgroundBaselineRisk,
         playgroundOptimise     } from "../../api/Optimise";
import { buildControlGroups }    from "../../utils/buildControlGroups";
import { useScenarioBuilder }    from "../../context/ScenarioBuilderContext";

/* ------------------------------------------------------------------ */
const ExplanationTab: React.FC = () => {
  /* shared optimiser result */
  const { result } = useOptimiser();

  /* tables from the builder */
  const {
    vertices, controlGroups, controlLevels, edges,
  } = useScenarioBuilder();

  /* build the full scenario whenever tables change */
  const scenario = useMemo(() => ({
    name: "builder",
    control_groups: buildControlGroups(controlGroups, controlLevels),
    vertices: vertices.map(v => ({ id: v.id, name: v.name })),
    edges: edges.map(e => ({
      source: e.source,
      target: e.target,
      default_flow: e.defaultFlow ?? 1,
      vulnerability: {
        name: e.vulnerability.name,
        controls: e.vulnerability.controls,
        adjustment: e.vulnerability.adjustment ?? {},
      },
    })),
    targets: vertices.filter(v => v.defaultTarget).map(v => v.id),
    targets_inclusion: {},
  }), [vertices, controlGroups, controlLevels, edges]);

  /* local state for baseline + marginal deltas */
  const [baseline, setBaseline] = useState<number | null>(null);
  const [deltas,   setDeltas]   = useState<Record<string, number>>({});
  const [busy,     setBusy]     = useState(false);

  /* ─── compute numbers whenever `result` changes ─────────────────── */
  useEffect(() => {
    if (!result) return;

    (async () => {
      setBusy(true);

      /* baseline (no controls) */
      const base = await playgroundBaselineRisk(scenario);
      setBaseline(base);

      /* marginal benefit for each chosen control (run in parallel) */
      const promises = result.selected_controls.map(async ctrl => {
        const scen = structuredClone(scenario);
        const grp  = scen.control_groups.find((g:any) => g.id === ctrl.group_id);
        if (grp) grp.levels = grp.levels.filter((l:any) => l.level === 0);

        const res = await playgroundOptimise({
          scenario: scen,
          budget: 1e9,
          indirect_budget: 1e9,
          targets: scen.targets,
        });
        return [ `${ctrl.group_id}-${ctrl.level}`, res.max_flow_to_targets ] as const;
      });

      const pairs = await Promise.all(promises);
      setDeltas(Object.fromEntries(pairs));
      setBusy(false);
    })();
  }, [result, scenario]);

  /* nothing to explain yet ----------------------------------------- */
  if (!result) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2">
          Run the optimiser first, then return here for the explanation.
        </Typography>
      </Box>
    );
  }

  if (busy || baseline === null) {
    return (
      <Box sx={{ p: 4, textAlign:"center" }}>
        <CircularProgress size={32}/>
      </Box>
    );
  }

  /* global improvement */
  const improvement =
    ((baseline - result.max_flow_to_targets) / baseline) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Why were these controls selected?
      </Typography>

      <Typography sx={{ mb: 2 }}>
        The optimiser picked <strong>{result.selected_controls.length}</strong>{" "}
        control{result.selected_controls.length !== 1 && "s"}, cutting the maximum
        flow from <strong>{baseline.toFixed(2)}</strong> to{" "}
        <strong>{result.max_flow_to_targets.toFixed(2)}</strong>{" "}
        (<strong>{improvement.toFixed(0)} % improvement</strong>).
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap:"wrap" }}>
        <Chip icon={<Paid />}     label={`Cost ${result.total_cost}`}             size="small"
              sx={{ bgcolor:"#e0f2fe", color:"#0284c7" }}/>
        <Chip icon={<Savings />}  label={`Indirect ${result.total_indirect_cost}`} size="small"
              sx={{ bgcolor:"#fef9c3", color:"#d97706" }}/>
      </Stack>

      {result.selected_controls.map(ctrl => {
        const key     = `${ctrl.group_id}-${ctrl.level}`;
        const riskW   = deltas[key];
        const impact  = ((riskW - result.max_flow_to_targets)
                         / result.max_flow_to_targets) * 100;

        return (
          <Accordion key={key} disableGutters
                     sx={{ mb:1, borderRadius:2, "&:before":{display:"none"} }}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Shield sx={{ mr:1, color:"#059669" }}/>
              <Typography>{ctrl.group_name} – {ctrl.level_name}</Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ pt:0 }}>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  <Paid fontSize="inherit" sx={{ mr:0.5 }}/>
                  Cost {ctrl.cost}
                </Typography>
                <Typography variant="body2">
                  <TrendingDown fontSize="inherit" sx={{ mr:0.5 }}/>
                  Flow now {ctrl.flow}
                </Typography>
                <Tooltip title="If you removed this control">
                  <Typography variant="body2" sx={{ display:"flex",alignItems:"center" }}>
                    <TrendingUp fontSize="inherit" sx={{ mr:0.5, color:"#dc2626" }}/>
                    Risk would rise&nbsp;{impact.toFixed(0)} %
                  </Typography>
                </Tooltip>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default ExplanationTab;
