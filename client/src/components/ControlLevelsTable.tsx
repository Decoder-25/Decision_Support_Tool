// src/components/ControlLevelsTable.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

export interface ControlLevel {
  groupId: string;   // e.g. "N1"
  level: number;     // e.g. 0,1,2…
  name: string;      // e.g. "firewall"
  cost: number;
  indCost: number;
  flow: number;
}

interface Props {
  controlLevels: ControlLevel[];
  setControlLevels: React.Dispatch<React.SetStateAction<ControlLevel[]>>;
}

/**
 * Find the next level number for a given groupId
 */
const getNextLevel = (
  levels: ControlLevel[],
  groupId: string
): number => {
  const existing = levels.filter((l) => l.groupId === groupId);
  if (existing.length === 0) return 1;
  return Math.max(...existing.map((l) => l.level)) + 1;
};

const ControlLevelsTable: React.FC<Props> = ({
  controlLevels,
  setControlLevels,
}) => {
  /* add-row state */
  const [newGroup, setNewGroup] = useState("");
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState<number>(0);
  const [newIndCost, setNewIndCost] = useState<number>(0);
  const [newFlow, setNewFlow] = useState<number>(1);
  const [error, setError] = useState("");

  /* compute next level number when group changes */
  const newLevel = useMemo(
    () => (newGroup.trim() ? getNextLevel(controlLevels, newGroup.trim()) : 1),
    [newGroup, controlLevels]
  );

  /* add handler */
  const handleAdd = () => {
    if (!newGroup.trim() || !newName.trim()) {
      setError("Group ID and Name are required");
      return;
    }
    setControlLevels([
      ...controlLevels,
      {
        groupId: newGroup.trim(),
        level: newLevel,
        name: newName.trim(),
        cost: newCost,
        indCost: newIndCost,
        flow: newFlow,
      },
    ]);
    setNewGroup("");
    setNewName("");
    setNewCost(0);
    setNewIndCost(0);
    setNewFlow(1);
    setError("");
  };

  /* delete handler */
  const handleDelete = (idx: number) => {
    setControlLevels(controlLevels.filter((_, i) => i !== idx));
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 4, fontWeight: 300, color: "#1e3a8a", letterSpacing: "0.5px" }}
      >
        Control levels
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              {[
                { label: "Group ID", width: 100 },
                { label: "Level", width: 80 },
                { label: "Name" },
                { label: "Cost", width: 80 },
                { label: "Indirect cost", width: 100 },
                { label: "Flow", width: 80 },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  align={col.align as any}
                  sx={{
                    fontWeight: 500,
                    color: "#475569",
                    fontSize: "0.875rem",
                    borderBottom: "1px solid #e2e8f0",
                    py: 2,
                    width: col.width,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 500,
                  width: 90,
                  color: "#475569",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #e2e8f0",
                  py: 2,
                }}
                align="center"
              >
                <Add sx={{ color: "#3b82f6", fontSize: "1.5rem" }} />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* ── Add row ── */}
            <TableRow
              sx={{
                backgroundColor: "#f0f9ff",
                "& td": { borderBottom: "1px solid #e0f2fe", py: 1.5 },
                "&:hover": { backgroundColor: "#e0f2fe" },
              }}
            >
              <TableCell>
                <TextField
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  size="small"
                  placeholder="Group ID"
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    width: "120px",
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={newLevel}
                  disabled
                  size="small"
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    width: 60,
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Name"
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={newCost}
                  onChange={(e) => setNewCost(Number(e.target.value))}
                  size="small"
                  type="number"
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    width: 70,
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={newIndCost}
                  onChange={(e) => setNewIndCost(Number(e.target.value))}
                  size="small"
                  type="number"
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    width: 70,
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={newFlow}
                  onChange={(e) => setNewFlow(Number(e.target.value))}
                  size="small"
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 1 }}
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    width: 80,
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={handleAdd}
                  sx={{
                    color: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(59, 130, 246, 0.16)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>

            {error && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 1 }}>
                  <Typography color="error" variant="caption" sx={{ pl: 1 }}>
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ── Existing rows ── */}
            {controlLevels
              .slice()
              .sort((a, b) => {
                if (a.groupId === b.groupId) return a.level - b.level;
                return a.groupId.localeCompare(b.groupId);
              })
              .map((lvl, idx) => (
                <TableRow
                  key={`${lvl.groupId}-${lvl.level}`}
                  sx={{
                    "&:hover": { backgroundColor: "#f8fafc" },
                    "& td": {
                      borderBottom:
                        idx === controlLevels.length - 1
                          ? "none"
                          : "1px solid #f1f5f9",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                    {lvl.groupId}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                    {lvl.level}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#1e293b" }}>
                    {lvl.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#1e293b" }}>
                    {lvl.cost}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#1e293b" }}>
                    {lvl.indCost}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "#1e293b" }}>
                    {lvl.flow}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton disabled sx={{ color: "#cbd5e1", mr: 0.5 }}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(idx)}
                      sx={{
                        color: "#64748b",
                        "&:hover": {
                          color: "#ef4444",
                          backgroundColor: "rgba(239, 68, 68, 0.08)",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ControlLevelsTable;
