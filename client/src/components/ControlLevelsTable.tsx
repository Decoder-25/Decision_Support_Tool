// src/components/ControlLevelsTable.tsx
import { useState, useMemo } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Delete, Edit, Check, Close } from "@mui/icons-material";
import type { ControlGroup } from "./ControlGroupsTable";

export interface ControlLevel {
  groupId: string;
  level: number;
  name: string;
  cost: number;
  indCost: number;
  flow: number;
}

interface Props {
  controlGroups: ControlGroup[];
  controlLevels: ControlLevel[];
  setControlLevels: React.Dispatch<React.SetStateAction<ControlLevel[]>>;
}

const ControlLevelsTable: React.FC<Props> = ({
  controlGroups,
  controlLevels,
  setControlLevels,
}) => {
  // ─── Add-row state ───
  const [newGroup, setNewGroup] = useState("");
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState(0);
  const [newIndCost, setNewIndCost] = useState(0);
  const [newFlow, setNewFlow] = useState(1);
  const [error, setError] = useState("");

  // ─── Edit-row state ───
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editGroup, setEditGroup] = useState("");
  const [editName, setEditName] = useState("");
  const [editCost, setEditCost] = useState(0);
  const [editIndCost, setEditIndCost] = useState(0);
  const [editFlow, setEditFlow] = useState(1);

  // ─── Compute declared count & nextLevel for Add ───
  const { nextLevel } = useMemo(() => {
    const groupDef = controlGroups.find((g) => g.id === newGroup);
    const count = groupDef?.levels.length ?? 0;
    const all = Array.from({ length: count }, (_, i) => i + 1);
    const used = controlLevels
      .filter((l) => l.groupId === newGroup)
      .map((l) => l.level);
    const avail = all.filter((lvl) => !used.includes(lvl));
    return { nextLevel: avail[0] };
  }, [newGroup, controlGroups, controlLevels]);

  // ─── Compute editLevel for Edit ───
  const editLevel = useMemo(() => {
    if (editIndex === null) return undefined;
    const groupDef = controlGroups.find((g) => g.id === editGroup);
    const count = groupDef?.levels.length ?? 0;
    const all = Array.from({ length: count }, (_, i) => i + 1);
    const used = controlLevels
      .filter((_, i) => i !== editIndex && controlLevels[i].groupId === editGroup)
      .map((l) => l.level);
    const avail = all.filter((lvl) => !used.includes(lvl));
    return avail[0];
  }, [editGroup, editIndex, controlGroups, controlLevels]);

  // ─── Handlers ───
  const handleAdd = () => {
    if (!newGroup || !newName.trim()) {
      setError("Group & Name required");
      return;
    }
    if (nextLevel === undefined) {
      setError(`All levels for “${newGroup}” added.`);
      return;
    }
    setControlLevels([
      ...controlLevels,
      {
        groupId: newGroup,
        level: nextLevel,
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

  const handleDelete = (idx: number) => {
    setControlLevels(controlLevels.filter((_, i) => i !== idx));
    if (editIndex === idx) setEditIndex(null);
  };

  const startEdit = (idx: number) => {
    const lvl = controlLevels[idx];
    setEditIndex(idx);
    setEditGroup(lvl.groupId);
    setEditName(lvl.name);
    setEditCost(lvl.cost);
    setEditIndCost(lvl.indCost);
    setEditFlow(lvl.flow);
    setError("");
  };

  const handleSave = (idx: number) => {
    if (!editGroup || !editName.trim()) {
      setError("Group & Name required");
      return;
    }
    if (editLevel === undefined) {
      setError(`All levels for “${editGroup}” used.`);
      return;
    }
    const updated: ControlLevel = {
      groupId: editGroup,
      level: editLevel,
      name: editName.trim(),
      cost: editCost,
      indCost: editIndCost,
      flow: editFlow,
    };
    setControlLevels(controlLevels.map((l, i) => (i === idx ? updated : l)));
    setEditIndex(null);
    setError("");
  };

  const handleCancel = () => {
    setEditIndex(null);
    setError("");
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
                { label: "Group ID", width: 120 },
                { label: "Level", width: 80 },
                { label: "Name" },
                { label: "Cost", width: 80 },
                { label: "Indirect cost", width: 100 },
                { label: "Flow", width: 80 },
              ].map((col) => (
                <TableCell
                  key={col.label}
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
              <TableCell align="center" sx={{ width: 90 }}>
                <Add sx={{ color: "#3b82f6", fontSize: 20 }} />
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
              {/* Group ID */}
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>Group ID</InputLabel>
                  <Select
                    value={newGroup}
                    label="Group ID"
                    onChange={(e) => setNewGroup(e.target.value as string)}
                  >
                    {controlGroups.map((g) => (
                      <MenuItem key={g.id} value={g.id}>
                        {g.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>

              {/* Level */}
              <TableCell>
                <TextField
                  size="small"
                  disabled
                  value={nextLevel ?? ""}
                  placeholder={nextLevel === undefined ? "—" : undefined}
                  sx={{ width: "100%" }}
                />
              </TableCell>

              {/* Name */}
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </TableCell>

              {/* Cost */}
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(+e.target.value)}
                />
              </TableCell>

              {/* Indirect cost */}
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={newIndCost}
                  onChange={(e) => setNewIndCost(+e.target.value)}
                />
              </TableCell>

              {/* Flow */}
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 1 }}
                  value={newFlow}
                  onChange={(e) => setNewFlow(+e.target.value)}
                />
              </TableCell>

              {/* Add button */}
              <TableCell align="center">
                <IconButton
                  onClick={handleAdd}
                  disabled={!newGroup || nextLevel === undefined}
                  sx={{ color: "#3b82f6" }}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>

            {/* ── Error or “all done” note ── */}
            {error && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 1 }}>
                  <Typography color="error" variant="caption">
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!error && newGroup && nextLevel === undefined && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 1 }}>
                  <Typography color="text.secondary" variant="body2">
                    👍 All levels for “{newGroup}” added.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ── Existing rows ── */}
            {controlLevels.map((lvl, idx) => {
              const isEditing = editIndex === idx;
              return (
                <TableRow
                  key={`${lvl.groupId}-${lvl.level}-${idx}`}
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
                  {/* Group ID */}
                  <TableCell>
                    {isEditing ? (
                      <FormControl fullWidth size="small">
                        <InputLabel>Group ID</InputLabel>
                        <Select
                          value={editGroup}
                          label="Group ID"
                          onChange={(e) =>
                            setEditGroup(e.target.value as string)
                          }
                        >
                          {controlGroups.map((g) => (
                            <MenuItem key={g.id} value={g.id}>
                              {g.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography sx={{ color: "#64748b" }}>
                        {lvl.groupId}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Level */}
                  <TableCell>
                    <Typography sx={{ color: "#64748b" }}>
                      {lvl.level}
                    </Typography>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ color: "#1e293b" }}>
                        {lvl.name}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Cost */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editCost}
                        onChange={(e) => setEditCost(+e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ color: "#1e293b" }}>
                        {lvl.cost}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Indirect cost */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editIndCost}
                        onChange={(e) => setEditIndCost(+e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ color: "#1e293b" }}>
                        {lvl.indCost}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Flow */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ step: 0.01, min: 0, max: 1 }}
                        value={editFlow}
                        onChange={(e) => setEditFlow(+e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ color: "#1e293b" }}>
                        {lvl.flow}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    {isEditing ? (
                      <>
                        <IconButton
                          onClick={() => handleSave(idx)}
                          sx={{ color: "#16a34a", mr: 1 }}
                        >
                          <Check />
                        </IconButton>
                        <IconButton
                          onClick={handleCancel}
                          sx={{ color: "#64748b" }}
                        >
                          <Close />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => startEdit(idx)}
                          sx={{
                            color: "#3b82f6",
                            mr: 1,
                            "&:hover": { backgroundColor: "rgba(59,130,246,0.08)" },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(idx)}
                          sx={{
                            color: "#64748b",
                            "&:hover": { color: "#ef4444" },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ControlLevelsTable;
