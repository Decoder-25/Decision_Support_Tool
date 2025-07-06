// src/components/RightPanelTabs/OptimizerTab.tsx

import React, { useState } from "react";
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
  Timeline,
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

export interface OptimizerResult {
  totalCost: number;
  indirectCost: number;
  maxFlow: number;
  selectedControls: string[];
}

interface OptimizerTabProps {
  vertices: Vertex[];
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
  edges: EdgeJson[];
  result?: OptimizerResult;
  onOptimise?: (args: {
    targets: number[];
    directBudget: number;
    indirectBudget: number;
  }) => void;
}

const OptimizerTab: React.FC<OptimizerTabProps> = ({
  vertices,
  result,
  onOptimise,
}) => {

    //console.log("Vertices from optmizer", vertices);
    
  const [directBudget, setDirectBudget] = useState<number>(0);
  const [indirectBudget, setIndirectBudget] = useState<number>(0);
  const [selectedTargets, setSelectedTargets] = useState<number[]>(
    () => vertices.filter(v => v.defaultTarget).map(v => v.id)
  );
  
  
  // Optional: sync with vertices updates (remove this if you don't want it to reset when vertices change)
  // useEffect(() => {
  //   setSelectedTargets(vertices.filter(v => v.defaultTarget).map(v => v.id));
  // }, [vertices]);
  
  const [optimising, setOptimising] = useState<boolean>(false);

  const handleOptimise = () => {
    setOptimising(true);
    if (onOptimise) {
      onOptimise({ targets: selectedTargets, directBudget, indirectBudget });
    }
    setTimeout(() => setOptimising(false), 800);
  };

  return (
    <Box>
      
      {/* Inputs Section */}
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: '1px solid #e3e8ef', background: '#f9fafb', mb: 3 }}
      >
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center' }}
        >
          <Settings sx={{ mr: 1 }} />
          Configuration Inputs
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Direct Budget */}
          <Box>
            <Typography gutterBottom>
              <AttachMoney sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Direct Budget: {directBudget}
            </Typography>
            <Slider
              value={directBudget}
              onChange={(_, v) => setDirectBudget(Number(v))}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              sx={{ color: '#2563eb' }}
            />
          </Box>

          {/* Indirect Budget */}
          <Box>
            <Typography gutterBottom>
              <Savings sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Indirect Budget: {indirectBudget}
            </Typography>
            <Slider
              value={indirectBudget}
              onChange={(_, v) => setIndirectBudget(Number(v))}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              sx={{ color: '#f59e0b' }}
            />
          </Box>

          {/* Targets Multi-Select */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Targets</InputLabel>
            <Select
              multiple
              value={selectedTargets}
              label="Targets"
              onChange={(e) => setSelectedTargets(e.target.value as number[])}
            >
              {vertices.map(v => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Optimise Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TrendingUp />}
              onClick={handleOptimise}
              disabled={optimising}
              sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', backgroundColor: '#2563eb' }}
            >
              {optimising ? 'Optimising...' : 'Optimise'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Results Section */}
      {result && (
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 2, border: '1px solid #e3e8ef', background: '#fff' }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center' }}
          >
            <Security sx={{ mr: 1 }} />
            Optimizer Result
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Paid />} label={`Total Cost: ${result.totalCost}`} sx={{ background: '#e0f2fe', color: '#0ea5e9' }} />
            <Chip icon={<Savings />} label={`Indirect Cost: ${result.indirectCost}`} sx={{ background: '#fef9c3', color: '#ca8a04' }} />
            <Chip icon={<Speed />} label={`Max Flow: ${result.maxFlow}`} sx={{ background: '#fce7f3', color: '#db2777' }} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Shield sx={{ mr: 1 }} />
            Selected Controls
          </Typography>

          <List dense disablePadding>
            {result.selectedControls.map(ctrl => (
              <ListItem key={ctrl} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ color: '#059669' }}><Shield /></ListItemIcon>
                <ListItemText primary={ctrl} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default OptimizerTab;
