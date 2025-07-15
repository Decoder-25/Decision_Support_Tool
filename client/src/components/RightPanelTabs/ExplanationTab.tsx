/*  src/components/RightPanelTabs/ExplanationTab.tsx
    Human‑readable “Why were these controls selected?” panel           */

    import React, { useEffect, useMemo, useState } from "react";
    import {
      Accordion, AccordionSummary, AccordionDetails,
      Box, Chip, CircularProgress, Stack, Tooltip, Typography
    } from "@mui/material";
    import {
      ExpandMore   as ExpandIcon,
      Paid, Savings, Shield,
      TrendingDown, TrendingUp
    } from "@mui/icons-material";
    
    import { useOptimiser }          from "../../context/OptimiserContext";
    import { useScenarioBuilder }    from "../../context/ScenarioBuilderContext";
    import { playgroundBaselineRisk,
             playgroundOptimise     } from "../../api/Optimise";
    import { buildControlGroups }    from "../../utils/buildControlGroups";
    
    const ExplanationTab: React.FC = () => {
      /* -------- shared optimiser result ------------------------------ */
      const { result } = useOptimiser();
    
      /* -------- scenario tables -------------------------------------- */
      const {
        vertices, controlGroups, controlLevels, edges,
      } = useScenarioBuilder();
    
      /* build a *complete* scenario object every time tables change */
      const scenario = useMemo(() => ({
        name: "builder",
        control_groups : buildControlGroups(controlGroups, controlLevels),
        vertices       : vertices.map(v => ({ id:v.id, name:v.name })),
        edges          : edges.map(e => ({
          source: e.source, target: e.target,
          default_flow: e.defaultFlow ?? 1,
          vulnerability: {
            name: e.vulnerability.name,
            controls: e.vulnerability.controls,
            adjustment: e.vulnerability.adjustment ?? {},
          },
        })),
        targets           : vertices.filter(v => v.defaultTarget).map(v => v.id),
        targets_inclusion : {},
      }), [vertices, controlGroups, controlLevels, edges]);
    
      /* -------- local state ------------------------------------------ */
      const [baseline, setBaseline] = useState<number | null>(null);         // risk with 0 controls
      const [deltas,   setDeltas]   = useState<Record<string, number>>({});  // risk if control X removed
      const [busy,     setBusy]     = useState(false);
    
      /* -------- recalc when optimiser finished ----------------------- */
      useEffect(() => {
        if (!result) return;
    
        (async () => {
          setBusy(true);
    
          /* ① baseline (spend $0) */
          const base = await playgroundBaselineRisk(scenario);
          setBaseline(base);
    
          /* ② marginal benefit (run in parallel) */
          const jobs = result.selected_controls.map(async ctrl => {
            const scen = structuredClone(scenario);
            const grp  = scen.control_groups.find((g:any)=>g.id===ctrl.group_id);
            if (grp) grp.levels = grp.levels.filter((l:any)=>l.level===0);
    
            const res = await playgroundOptimise({
              scenario: scen,
              budget: 1e9, indirect_budget: 1e9, targets: scen.targets,
            });
            return [ `${ctrl.group_id}-${ctrl.level}`, res.max_flow_to_targets ] as const;
          });
    
          setDeltas(Object.fromEntries(await Promise.all(jobs)));
          setBusy(false);
        })();
      }, [result, scenario]);
    
      /* ---------------------------------------------------------------- */
      if (!result) {
        return (
          <Box sx={{ p:3 }}>
            <Typography variant="body2">
              Run the optimiser first, then switch back for the explanation.
            </Typography>
          </Box>
        );
      }
      if (busy || baseline === null) {
        return <Box sx={{ p:4, textAlign:"center" }}><CircularProgress /></Box>;
      }
    
      const globalImprovement =
        ((baseline - result.max_flow_to_targets) / baseline) * 100;
    
      return (
        <Box sx={{ p:3 }}>
          {/* ----- headline ------------------------------------------------ */}
          <Typography variant="h6" gutterBottom>
            Why were these controls selected?
          </Typography>
    
          <Typography sx={{ mb:2 }}>
            The optimiser picked <strong>{result.selected_controls.length}</strong>{" "}
            control{result.selected_controls.length!==1 && "s"}, cutting the maximum
            flow from <strong>{baseline.toFixed(2)}</strong> to{" "}
            <strong>{result.max_flow_to_targets.toFixed(2)}</strong>{" "}
            (<strong>{globalImprovement.toFixed(0)} % improvement</strong>).
          </Typography>
    
          {/* overall spend */}
          <Stack direction="row" spacing={1} sx={{ mb:3, flexWrap:"wrap" }}>
            <Chip icon={<Paid   />} label={`Cost ${result.total_cost}`}
                  size="small" sx={{ bgcolor:"#e0f2fe", color:"#0284c7" }}/>
            <Chip icon={<Savings/>} label={`Indirect ${result.total_indirect_cost}`}
                  size="small" sx={{ bgcolor:"#fef9c3", color:"#d97706" }}/>
          </Stack>
    
          {/* ----- one accordion per chosen control ----------------------- */}
          {result.selected_controls.map(ctrl => {
            const key       = `${ctrl.group_id}-${ctrl.level}`;
            const riskIfOff = deltas[key] ?? baseline;
            const delta     = riskIfOff - result.max_flow_to_targets;
            const factor    = riskIfOff / result.max_flow_to_targets;
    
            /* how many edges reference this control? */
            const hits = edges.filter(e =>
              Object.keys(e.vulnerability?.controls ?? {})
                    .includes(ctrl.group_id)
            ).length;
    
            /* cost efficiency */
            const eff  = ctrl.cost ? delta / ctrl.cost : null;
    
            return (
              <Accordion key={key} disableGutters
                         sx={{ mb:1, borderRadius:2, "&:before":{ display:"none" }}}>
                <AccordionSummary expandIcon={<ExpandIcon/>}>
                  <Shield sx={{ mr:1, color:"#059669" }}/>
                  <Typography>{ctrl.group_name} – {ctrl.level_name}</Typography>
                </AccordionSummary>
    
                <AccordionDetails sx={{ pt:0 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      <Paid fontSize="inherit" sx={{ mr:0.5 }}/>
                      Cost {ctrl.cost}
                    </Typography>
    
                    <Typography variant="body2">
                      <TrendingDown fontSize="inherit" sx={{ mr:0.5 }}/>
                      Flow now {ctrl.flow}
                    </Typography>
    
                    <Tooltip title="If you removed this control">
                      <Typography variant="body2"
                                  sx={{ display:"flex", alignItems:"center" }}>
                        <TrendingUp fontSize="inherit"
                                    sx={{ mr:0.5, color:"#dc2626" }}/>
                        Risk would jump to {riskIfOff.toFixed(2)}
                        {" "}(≈ {factor.toFixed(1)}× higher, Δ {delta.toFixed(2)})
                      </Typography>
                    </Tooltip>
    
                    <Typography variant="body2">
                      • Blocks <strong>{hits}</strong> attack path{hits!==1 && "s"}
                    </Typography>
    
                    {eff !== null &&
                      <Chip size="small"
                            label={`Δ ${delta.toFixed(2)} / $${ctrl.cost} = ${eff.toFixed(2)}`}
                            sx={{ bgcolor:"#f0fdfa", color:"#047857" }}/>}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      );
    };
    
    export default ExplanationTab;
    