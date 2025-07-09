// src/components/EdgesTable.tsx
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
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add, Delete, Edit, Check, Close } from "@mui/icons-material";
import type { Props } from "../types/edgesTablesTypes";

const EdgesTable: React.FC<Props> = ({
  vertices,
  controlGroups,
  edges,
  setEdges,
}) => {
  // ─── Add‑row state ───
  const [newSource, setNewSource] = useState<number>(vertices[0]?.id ?? 0);
  const [newTarget, setNewTarget] = useState<number>(
    vertices[1]?.id ?? vertices[0]?.id ?? 0
  );
  const [newDefaultFlow, setNewDefaultFlow] = useState<number>(1);
  const [newVulnName, setNewVulnName] = useState<string>("");
  const [newControls, setNewControls] = useState<string>(""); // semicolon‑separated
  const [newUrl, setNewUrl] = useState<string>("");
  const [addError, setAddError] = useState<string>("");

  // ─── Edit‑row state ───
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editSource, setEditSource] = useState<number>(0);
  const [editTarget, setEditTarget] = useState<number>(0);
  const [editDefaultFlow, setEditDefaultFlow] = useState<number>(1);
  const [editVulnName, setEditVulnName] = useState<string>("");
  const [editControls, setEditControls] = useState<string>("");
  const [editUrl, setEditUrl] = useState<string>("");
  const [editError, setEditError] = useState<string>("");

  // ─── Options for the drop‑downs ───
  const vertexOptions = useMemo(
    () =>
      vertices.map((v) => (
        <MenuItem key={v.id} value={v.id}>
          {v.name}
        </MenuItem>
      )),
    [vertices]
  );
  const groupOptions = useMemo(
    () =>
      controlGroups.map((g) => (
        <MenuItem key={g.id} value={g.id}>
          {g.id}
        </MenuItem>
      )),
    [controlGroups]
  );

  // ─── Disable Add if name missing or source=target ───
  const isAddDisabled =
    !newVulnName.trim() || newSource === newTarget;

  // ─── Add a new edge ───
  const handleAdd = () => {
    let err = "";
    if (!newVulnName.trim()) {
      err = "Vulnerability name is required";
    } else if (newSource === newTarget) {
      err = "Source and target must differ";
    }

    if (err) {
      setAddError(err);
      return;
    }

    const controlsArr = newControls
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    setEdges([
      ...edges,
      {
        source: newSource,
        target: newTarget,
        defaultFlow: newDefaultFlow,
        vulnerability: { name: newVulnName.trim(), controls: controlsArr },
        url: newUrl.trim() || undefined,
      },
    ]);

    // reset
    setNewDefaultFlow(1);
    setNewVulnName("");
    setNewControls("");
    setNewUrl("");
    setAddError("");
  };

  // ─── Delete an edge ───
  const handleDelete = (idx: number) => {
    setEdges(edges.filter((_, i) => i !== idx));
    if (editIndex === idx) {
      setEditIndex(null);
      setEditError("");
    }
  };

  // ─── Begin editing an edge ───
  const startEdit = (idx: number) => {
    const e = edges[idx];
    setEditIndex(idx);
    setEditSource(e.source);
    setEditTarget(e.target);
    setEditDefaultFlow(e.defaultFlow);
    setEditVulnName(e.vulnerability.name);
    setEditControls(e.vulnerability.controls.join(";"));
    setEditUrl(e.url || "");
    setEditError("");
  };

  // ─── Save edits ───
  const handleSave = (idx: number) => {
    let err = "";
    if (!editVulnName.trim()) {
      err = "Vulnerability name is required";
    } else if (editSource === editTarget) {
      err = "Source and target must differ";
    }
    if (err) {
      setEditError(err);
      return;
    }

    const controlsArr = editControls
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    setEdges(
      edges.map((e, i) =>
        i === idx
          ? {
              source: editSource,
              target: editTarget,
              defaultFlow: editDefaultFlow,
              vulnerability: { name: editVulnName.trim(), controls: controlsArr },
              url: editUrl.trim() || undefined,
            }
          : e
      )
    );
    setEditIndex(null);
    setEditError("");
  };

  // ─── Cancel edit ───
  const handleCancel = () => {
    setEditIndex(null);
    setEditError("");
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 4, fontWeight: 300, color: "#1e3a8a", letterSpacing: "0.5px" }}
      >
        Edges
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
                { label: "Source", width: 120 },
                { label: "Target", width: 120 },
                { label: "Default flow", width: 100 },
                { label: "Vulnerability name" },
                { label: "Valid controls (optional)", width: 160 },
                { label: "URL (optional)", width: 180 },
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
              <TableCell
                align="center"
                sx={{
                  fontWeight: 500,
                  color: "#475569",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #f8fafc",
                  width: 90,
                }}
              >
                <Add sx={{ color: "#3b82f6", fontSize: "1.5rem" }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ── Add‑row ── */}
            <TableRow
              sx={{
                backgroundColor: "#f0f9ff",
                "& td": { borderBottom: "1px solid #e0f2fe", py: 1.5 },
                "&:hover": { backgroundColor: "#e0f2fe" },
              }}
            >
              {/* Source */}
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={newSource}
                    label="Source"
                    onChange={(e) => setNewSource(Number(e.target.value))}
                  >
                    {vertexOptions}
                  </Select>
                </FormControl>
              </TableCell>

              {/* Target */}
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>Target</InputLabel>
                  <Select
                    value={newTarget}
                    label="Target"
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                  >
                    {vertexOptions}
                  </Select>
                </FormControl>
              </TableCell>

              {/* Default flow */}
              <TableCell>
                <TextField
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 1 }}
                  size="small"
                  value={newDefaultFlow}
                  onChange={(e) => setNewDefaultFlow(Number(e.target.value))}
                  sx={{ width: "100%" }}
                />
              </TableCell>

              {/* Vulnerability name */}
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Name"
                  value={newVulnName}
                  onChange={(e) => setNewVulnName(e.target.value)}
                />
              </TableCell>

              {/* Valid controls (optional) */}
              <TableCell>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel id="edge-controls-label">Controls</InputLabel>
                  <Select
                    multiple
                    labelId="edge-controls-label"
                    label="Controls"
                    value={newControls.split(";").filter(Boolean)}
                    onChange={(e) =>
                      setNewControls((e.target.value as string[]).join(";"))
                    }
                    sx={{ borderRadius: 1 }}
                  >
                    {groupOptions}
                  </Select>
                </FormControl>
              </TableCell>

              {/* URL (optional) */}
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </TableCell>

              {/* Add button */}
              <TableCell align="center">
                <IconButton
                  onClick={handleAdd}
                  disabled={isAddDisabled}
                  sx={{
                    color: "#3b82f6",
                    backgroundColor: isAddDisabled
                      ? "rgba(59,130,246,0.12)"
                      : "rgba(59,130,246,0.08)",
                  }}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>

            {/* ── “Source=Target” error ── */}
            {newSource === newTarget && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 1 }}>
                  <Typography color="error" variant="caption">
                    Source and target must differ
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ── Name missing error ── */}
            {addError && newSource !== newTarget && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 1 }}>
                  <Typography color="error" variant="caption">
                    {addError}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ── No‑data placeholder ── */}
            {edges.length === 0 && !addError && newSource !== newTarget && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No edges defined yet. Add one above.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ── Existing rows ── */}
            {edges.map((e, idx) => {
              const isEditing = editIndex === idx;
              return (
                <TableRow
                  key={`${e.source}-${e.target}-${idx}`}
                  sx={{
                    "&:hover": { backgroundColor: "#f8fafc" },
                    "& td": {
                      borderBottom:
                        idx === edges.length - 1
                          ? "none"
                          : "1px solid #f1f5f9",
                      py: 1.5,
                    },
                  }}
                >
                  {/* Source */}
                  <TableCell sx={{ width: 120 }}>
                    {isEditing ? (
                      <FormControl fullWidth size="small">
                        <InputLabel>Source</InputLabel>
                        <Select
                          value={editSource}
                          label="Source"
                          onChange={(e) =>
                            setEditSource(Number(e.target.value))
                          }
                        >
                          {vertexOptions}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {
                          vertices.find((v) => v.id === e.source)?.name ??
                          e.source
                        }
                      </Typography>
                    )}
                  </TableCell>

                  {/* Target */}
                  <TableCell sx={{ width: 120 }}>
                    {isEditing ? (
                      <FormControl fullWidth size="small">
                        <InputLabel>Target</InputLabel>
                        <Select
                          value={editTarget}
                          label="Target"
                          onChange={(e) =>
                            setEditTarget(Number(e.target.value))
                          }
                        >
                          {vertexOptions}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {
                          vertices.find((v) => v.id === e.target)?.name ??
                          e.target
                        }
                      </Typography>
                    )}
                  </TableCell>

                  {/* Default flow */}
                  <TableCell sx={{ width: 100 }}>
                    {isEditing ? (
                      <TextField
                        type="number"
                        inputProps={{ step: 0.01, min: 0, max: 1 }}
                        size="small"
                        value={editDefaultFlow}
                        onChange={(e) =>
                          setEditDefaultFlow(Number(e.target.value))
                        }
                        sx={{ width: "100%" }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {e.defaultFlow}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Vulnerability name */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editVulnName}
                        onChange={(e) => setEditVulnName(e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {e.vulnerability.name}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Valid controls */}
                  <TableCell sx={{ width: 160 }}>
                    {isEditing ? (
                      <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel id={`edit-controls-label-${idx}`}>Controls</InputLabel>
                        <Select
                          multiple
                           labelId={`edit-controls-label-${idx}`}
                            label="Controls"
                          value={editControls.split(";").filter(Boolean)}
                          onChange={(e) =>
                            setEditControls((e.target.value as string[]).join(
                              ";"
                            ))
                          }
                          sx={{ borderRadius: 1 }}
                        >
                          {groupOptions}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {e.vulnerability.controls.join(";")}
                      </Typography>
                    )}
                  </TableCell>

                  {/* URL */}
                  <TableCell sx={{ width: 180 }}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {e.url ?? ""}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center" sx={{ width: 90 }}>
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
                        {editError && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: "block", mt: 1 }}
                          >
                            {editError}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => startEdit(idx)}
                          sx={{
                            color: "#3b82f6",
                            mr: 1,
                            "&:hover": {
                              backgroundColor: "rgba(59,130,246,0.08)",
                            },
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

export default EdgesTable;
