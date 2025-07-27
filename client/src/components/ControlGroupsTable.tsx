// src/components/ControlGroupsTable.tsx
import  { useState, useMemo } from "react";
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
import { Add, Delete, Edit, Check, Close } from "@mui/icons-material";

export interface ControlLevel {
  level: number;
  name: string;
  cost: number;
  ind_cost: number;
  flow: number;
}

export interface ControlGroup {
  id: string;
  name: string;
  no_control_name: string;
  levels: ControlLevel[];
}

interface Props {
  controlGroups: ControlGroup[];
  setControlGroups: React.Dispatch<React.SetStateAction<ControlGroup[]>>;
}

const ControlGroupsTable: React.FC<Props> = ({
  controlGroups,
  setControlGroups,
}) => {
  // ─── Add‐row state ───
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState(1);
  const [newNoName, setNewNoName] = useState("None");
  const [error, setError] = useState("");

  // ─── Edit‐row state ───
  const [editId, setEditId] = useState<string | null>(null);
  const [editNewId, setEditNewId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCount, setEditCount] = useState(1);
  const [editNoName, setEditNoName] = useState("None");

  // For checking dupes in add‐row and edit‐row
  const idExists = useMemo(
    () =>
      controlGroups.some(
        (g) => g.id.toLowerCase() === newId.toLowerCase()
      ),
    [newId, controlGroups]
  );
  const editIdExists = useMemo(
    () =>
      controlGroups.some(
        (g) =>
          g.id.toLowerCase() === editNewId.toLowerCase() && g.id !== editId
      ),
    [editNewId, editId, controlGroups]
  );

  // ─── Handlers ───
  const handleAdd = () => {
    if (!newId.trim() || !newName.trim()) {
      setError("ID & Name required");
      return;
    }
    if (idExists) {
      setError("ID already exists");
      return;
    }
    const levels: ControlLevel[] = Array.from({ length: newCount }).map(
      (_, i) => ({
        level: i,
        name: i === 0 ? newNoName.trim() || "None" : `Level ${i}`,
        cost: 0,
        ind_cost: 0,
        flow: 1,
      })
    );
    setControlGroups([
      ...controlGroups,
      {
        id: newId.trim(),
        name: newName.trim(),
        no_control_name: newNoName.trim() || "None",
        levels,
      },
    ]);
    // reset
    setNewId("");
    setNewName("");
    setNewCount(1);
    setNewNoName("None");
    setError("");
  };

  const handleDelete = (id: string) => {
    setControlGroups((prev) => prev.filter((g) => g.id !== id));
    if (editId === id) setEditId(null);
  };

  const handleEdit = (g: ControlGroup) => {
    setEditId(g.id);
    setEditNewId(g.id);
    setEditName(g.name);
    setEditCount(g.levels.length);
    setEditNoName(g.no_control_name);
    setError("");
  };

  const handleSave = (originalId: string) => {
    if (!editNewId.trim() || !editName.trim()) {
      setError("ID & Name required");
      return;
    }
    if (editIdExists) {
      setError("ID already exists");
      return;
    }
    if (editCount < 1) {
      setError("Levels must be ≥ 1");
      return;
    }
    const levels: ControlLevel[] = Array.from({ length: editCount }).map(
      (_, i) => ({
        level: i,
        name: i === 0 ? editNoName.trim() || "None" : `Level ${i}`,
        cost: 0,
        ind_cost: 0,
        flow: 1,
      })
    );
    setControlGroups((prev) =>
      prev.map((g) =>
        g.id === originalId
          ? {
              id: editNewId.trim(),
              name: editName.trim(),
              no_control_name: editNoName.trim() || "None",
              levels,
            }
          : g
      )
    );
    setEditId(null);
    setError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setError("");
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 4, fontWeight: 300, color: "#1e3a8a", letterSpacing: "0.5px" }}
      >
        Control groups
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
              {["ID", "Name", "Levels", "Selected level", ""].map(
                (h, idx) => (
                  <TableCell
                    key={h}
                    align={idx >= 2 && idx < 4 ? "center" : undefined}
                    sx={{
                      fontWeight: 500,
                      color: "#475569",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid #e2e8f0",
                      py: 2,
                      ...(idx === 0 && { width: 80 }),
                      ...(idx === 2 && { width: 140 }),
                      ...(idx === 4 && { width: 90, textAlign: "center" }),
                    }}
                  >
                    {idx === 4 ? (
                      <Add sx={{ color: "#3b82f6", fontSize: "1.5rem" }} />
                    ) : (
                      h
                    )}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* add-row */}
            <TableRow
              sx={{
                backgroundColor: "#f0f9ff",
                "& td": { borderBottom: "1px solid #e0f2fe", py: 2 },
                "&:hover": { backgroundColor: "#e0f2fe" },
              }}
            >
              <TableCell>
                <TextField
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  size="small"
                  placeholder="ID"
                  error={!!error && (!newId.trim() || idExists)}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    width: 60,
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                      borderWidth: 1,
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  size="small"
                  placeholder="Enter group name"
                  error={!!error && !newName.trim()}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                    },
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  type="number"
                  value={newCount}
                  onChange={(e) =>
                    setNewCount(Math.max(1, Number(e.target.value)))
                  }
                  size="small"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    width: 80,
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                    },
                  }}
                  inputProps={{ min: 1 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  value={newNoName}
                  onChange={(e) => setNewNoName(e.target.value)}
                  size="small"
                  placeholder="None"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                    },
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={handleAdd}
                  sx={{
                    color: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(59,130,246,0.16)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>

            {error && (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 1 }}>
                  <Typography color="error" variant="caption">
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* existing rows */}
            {controlGroups.map((g, i) => {
              const isEditing = editId === g.id;
              return (
                <TableRow
                  key={g.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f8fafc" },
                    "& td": {
                      borderBottom:
                        i === controlGroups.length - 1
                          ? "none"
                          : "1px solid #f1f5f9",
                      py: 2,
                    },
                  }}
                >
                  {/* ID cell */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editNewId}
                        onChange={(e) => setEditNewId(e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <Typography sx={{ color: "#64748b", fontWeight: 500 }}>
                        {g.id}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <Typography sx={{ color: "#1e293b" }}>{g.name}</Typography>
                    )}
                  </TableCell>

                  {/* Levels */}
                  <TableCell align="center">
                    {isEditing ? (
                      <TextField
                        type="number"
                        value={editCount}
                        onChange={(e) =>
                          setEditCount(Math.max(1, Number(e.target.value)))
                        }
                        size="small"
                        sx={{ width: 80 }}
                        inputProps={{ min: 1 }}
                      />
                    ) : (
                      g.levels.length
                    )}
                  </TableCell>

                  {/* Selected level */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editNoName}
                        onChange={(e) => setEditNoName(e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <Typography sx={{ color: "#1e293b" }}>
                        {g.no_control_name}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    {isEditing ? (
                      <>
                        <IconButton
                          onClick={() => handleSave(g.id)}
                          sx={{ color: "#16a34a", mr: 0.5 }}
                        >
                          <Check />
                        </IconButton>
                        <IconButton onClick={handleCancel} sx={{ color: "#64748b" }}>
                          <Close />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEdit(g)}
                          sx={{
                            color: "#3b82f6",
                            mr: 0.5,
                            "&:hover": { backgroundColor: "rgba(59,130,246,0.08)" },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(g.id)}
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

export default ControlGroupsTable;
