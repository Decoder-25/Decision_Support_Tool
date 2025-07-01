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
import { Add, Delete } from "@mui/icons-material";
import type { Props } from "../types/edgesTablesTypes";

/* ─────────────── Component ─────────────── */
const EdgesTable: React.FC<Props> = ({
  vertices,
  controlGroups,
  edges,
  setEdges,
}) => {
  /* ─── add-row state ─── */
  const [newSource, setNewSource] = useState<number>(vertices[0]?.id ?? 0);
  const [newTarget, setNewTarget] = useState<number>(
    vertices[1]?.id ?? vertices[0]?.id ?? 0
  );
  const [newDefaultFlow, setNewDefaultFlow] = useState<number>(1);
  const [newVulnName, setNewVulnName] = useState<string>("");
  const [newControls, setNewControls] = useState<string>(""); // semicolon-separated
  const [newUrl, setNewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  /* ─── Helpers ─── */
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

  /* ─── Add handler ─── */
  const handleAdd = () => {
    if (
      newVulnName.trim() === "" ||
      newSource === newTarget ||
      newControls.trim() === ""
    ) {
      setError(
        newVulnName.trim() === ""
          ? "Vulnerability name required"
          : newSource === newTarget
          ? "Source ≠ Target"
          : "At least one control"
      );
      return;
    }
    const controlsArr = newControls
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s);

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
    setError("");
  };

  /* ─── Delete handler ─── */
  const handleDelete = (idx: number) => {
    setEdges(edges.filter((_, i) => i !== idx));
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
                { label: "Valid controls", width: 140 },
                { label: "URL (optional)", width: 180 },
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
                  borderBottom: "1px solid #e2e8f0",
                  width: 90,
                }}
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
              {/* Source */}
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={newSource}
                    label="Source"
                    onChange={(e) => setNewSource(Number(e.target.value))}
                    sx={{ borderRadius: "8px", backgroundColor: "#fff" }}
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
                    sx={{ borderRadius: "8px", backgroundColor: "#fff" }}
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
                  sx={{
                    width: "80px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  }}
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
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  }}
                />
              </TableCell>

              {/* Valid controls */}
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>Controls</InputLabel>
                  <Select
                    multiple
                    value={newControls.split(";").filter((s) => s)}
                    onChange={(e) =>
                      setNewControls(
                        (e.target.value as string[]).join(";")
                      )
                    }
                    label="Controls"
                    sx={{ borderRadius: "8px", backgroundColor: "#fff" }}
                  >
                    {groupOptions}
                  </Select>
                </FormControl>
              </TableCell>

              {/* URL */}
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  }}
                />
              </TableCell>

              {/* Add button */}
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

            {/* ── Error row ── */}
            {error && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 1 }}>
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ pl: 1 }}
                  >
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ── Existing rows ── */}
            {edges.map((e, idx) => (
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
                <TableCell sx={{ fontSize: "0.875rem" }}>
                  {vertices.find((v) => v.id === e.source)?.name ||
                    e.source}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem" }}>
                  {vertices.find((v) => v.id === e.target)?.name ||
                    e.target}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem" }}>
                  {e.defaultFlow}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem" }}>
                  {e.vulnerability.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem" }}>
                  {e.vulnerability.controls.join(";")}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem" }}>
                  {e.url || ""}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleDelete(idx)}
                    sx={{
                      color: "#64748b",
                      "&:hover": {
                        color: "#ef4444",
                        backgroundColor: "rgba(239, 68, 68, 0.08)",
                        transform: "scale(1.05)",
                      },
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

export default EdgesTable;
