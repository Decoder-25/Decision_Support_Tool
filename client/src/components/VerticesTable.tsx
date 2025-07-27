// src/components/VerticesTable.tsx
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
  Checkbox,
  IconButton,
} from "@mui/material";
import { Add, Delete, Edit, Check, Close } from "@mui/icons-material";

export interface Vertex {
  id: number;
  name: string;
  defaultTarget?: boolean;
}

interface Props {
  vertices: Vertex[];
  setVertices: React.Dispatch<React.SetStateAction<Vertex[]>>;
}

const getNextAvailableId = (current: Vertex[]): number => {
  const used = new Set(current.map((v) => v.id));
  let i = 0;
  while (used.has(i)) i += 1;
  return i;
};

const VerticesTable: React.FC<Props> = ({ vertices, setVertices }) => {
  // state for “add new”
  const [newName, setNewName] = useState("");
  const [newDefaultTarget, setNewDefaultTarget] = useState(false);
  const [error, setError] = useState("");
  const nextId = useMemo(() => getNextAvailableId(vertices), [vertices]);

  // state for “in‑row editing”
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDefaultTarget, setEditDefaultTarget] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) {
      setError("Name is required");
      return;
    }
    setVertices((prev) => [
      ...prev,
      { id: nextId, name: newName.trim(), defaultTarget: newDefaultTarget },
    ]);
    setNewName("");
    setNewDefaultTarget(false);
    setError("");
  };

  const handleDelete = (id: number) => {
    setVertices((prev) => {
      const filtered = prev.filter((v) => v.id !== id).sort((a, b) => a.id - b.id);
      return filtered.map((v, idx) => ({ ...v, id: idx }));
    });
    // if you deleted the row you were editing, cancel edit mode
    if (editId === id) setEditId(null);
  };

  const toggleDefaultTarget = (id: number) => {
    setVertices((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, defaultTarget: !v.defaultTarget } : v
      )
    );
  };

  // ---- Edit handlers ----
  const handleEdit = (v: Vertex) => {
    setEditId(v.id);
    setEditName(v.name);
    setEditDefaultTarget(!!v.defaultTarget);
  };

  const handleSave = (id: number) => {
    if (!editName.trim()) {
      setError("Name is required");
      return;
    }
    setVertices((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, name: editName.trim(), defaultTarget: editDefaultTarget }
          : v
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
        Vertices
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
              {["ID", "Name", "Default Target", ""].map((h, i) => (
                <TableCell
                  key={h}
                  align={i === 2 ? "center" : undefined}
                  sx={{
                    fontWeight: 500,
                    color: "#475569",
                    fontSize: "0.875rem",
                    borderBottom: "1px solid #e2e8f0",
                    py: 2,
                    ...(i === 0 && { width: 80 }),
                    ...(i === 2 && { width: 140 }),
                    ...(i === 3 && { width: 90, textAlign: "center" }),
                  }}
                >
                  {i === 3 ? <Add sx={{ color: "#3b82f6", fontSize: "1.5rem" }} /> : h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ----- add row ----- */}
            <TableRow
              sx={{
                backgroundColor: "#f0f9ff",
                "& td": { borderBottom: "1px solid #e0f2fe", py: 2 },
                "&:hover": { backgroundColor: "#e0f2fe" },
              }}
            >
              <TableCell>
                <TextField
                  disabled
                  value={nextId}
                  size="small"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#cbd5e1", borderWidth: 1 },
                      "&.Mui-disabled fieldset": { borderColor: "#e2e8f0" },
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter vertex name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  error={!!error && !newName.trim()}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#cbd5e1" },
                      "&:hover fieldset": { borderColor: "#3b82f6" },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 },
                      "&.Mui-error fieldset": { borderColor: "#ef4444" },
                    },
                    "& .MuiInputBase-input::placeholder": { color: "#94a3b8" },
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={newDefaultTarget}
                  onChange={(e) => setNewDefaultTarget(e.target.checked)}
                  sx={{
                    color: "#cbd5e1",
                    "&.Mui-checked": { color: "#3b82f6" },
                    "&:hover": { backgroundColor: "rgba(59,130,246,0.04)" },
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={handleAdd}
                  sx={{
                    color: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.08)",
                    "&:hover": { backgroundColor: "rgba(59,130,246,0.16)", transform: "scale(1.05)" },
                  }}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>

            {error && (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 1 }}>
                  <Typography sx={{ color: "#ef4444", fontSize: 12, pl: 1 }}>
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ----- existing rows ----- */}
            {vertices
              .slice()
              .sort((a, b) => a.id - b.id)
              .map((v, idx) => {
                const isEditing = editId === v.id;
                return (
                  <TableRow
                    key={v.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f8fafc" },
                      "& td": {
                        borderBottom: idx === vertices.length - 1 ? "none" : "1px solid #f1f5f9",
                        py: 2,
                      },
                    }}
                  >
                    {/* ID */}
                    <TableCell sx={{ color: "#64748b", fontWeight: 500 }}>
                      {v.id}
                    </TableCell>

                    {/* Name */}
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          size="small"
                          sx={{ width: "100%" }}
                        />
                      ) : (
                        <Typography sx={{ color: "#1e293b" }}>{v.name}</Typography>
                      )}
                    </TableCell>

                    {/* Default Target */}
                    <TableCell align="center">
                      {isEditing ? (
                        <Checkbox
                          checked={editDefaultTarget}
                          onChange={(e) => setEditDefaultTarget(e.target.checked)}
                        />
                      ) : (
                        <Checkbox
                          checked={!!v.defaultTarget}
                          onChange={() => toggleDefaultTarget(v.id)}
                        />
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      {isEditing ? (
                        <>
                          <IconButton
                            onClick={() => handleSave(v.id)}
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
                            onClick={() => handleEdit(v)}
                            sx={{ color: "#3b82f6", mr: 0.5 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(v.id)}
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

export default VerticesTable;
