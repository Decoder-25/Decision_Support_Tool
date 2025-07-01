import React, { useState, useMemo } from "react";
import {Box,Typography, Table,TableBody,TableCell, TableHead, TableRow, Paper, TextField,IconButton} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import {TableContainer} from "@mui/material";

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


const ControlGroupsTable: React.FC<Props> = ({controlGroups,setControlGroups,}) => {

  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState(1);
  const [newNoName, setNewNoName] = useState("None");
  const [error, setError] = useState("");

  const idExists = useMemo(
    () => controlGroups.some((g) => g.id.toLowerCase() === newId.toLowerCase()),
    [newId, controlGroups]
  );

  const handleAdd = () => {
    if (!newId.trim() || !newName.trim()) {
      setError("ID & Name required");
      return;
    }
    if (idExists) {
      setError("ID already exists");
      return;
    }
    // build empty levels
    const levels: ControlLevel[] = Array.from({ length: newCount }).map(
      (_, i) => ({
        level: i,
        name: i === 0 ? newNoName : `Level ${i}`,
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

  const handleDelete = (id: string) =>
    setControlGroups(controlGroups.filter((g) => g.id !== id));

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
              <TableCell
                sx={{
                  fontWeight: 500,
                  width: 80,
                  color: "#475569",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #e2e8f0",
                  py: 2,
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#475569",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #e2e8f0",
                  py: 2,
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  width: 140,
                  color: "#475569",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #e2e8f0",
                  py: 2,
                  textAlign: "center",
                }}
              >
                 Levels
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "#475569",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #e2e8f0",
                  py: 2,
                }}
              >
                Selected level
              </TableCell>
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
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    width: "60px",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                      borderWidth: "1px",
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
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                      borderWidth: "1px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#94a3b8",
                      opacity: 1,
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
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    width: "80px",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                      borderWidth: "1px",
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
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderColor: "#cbd5e1",
                      borderWidth: "1px",
                    },
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
                <TableCell colSpan={5}>
                  <Typography color="error" variant="caption">
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* existing rows */}
            {controlGroups.map((g, i) => (
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
                <TableCell sx={{ color: "#64748b", fontWeight: 500 }}>
                  {g.id}
                </TableCell>
                <TableCell sx={{ color: "#1e293b" }}>{g.name}</TableCell>
                <TableCell align="center">
                  {g.levels.length}
                </TableCell>
                <TableCell sx={{ color: "#1e293b" }}>
                  {g.no_control_name}
                </TableCell>
                <TableCell align="center">
                  <IconButton disabled sx={{ color: "#cbd5e1", mr: 0.5 }}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(g.id)}
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

export default ControlGroupsTable;
