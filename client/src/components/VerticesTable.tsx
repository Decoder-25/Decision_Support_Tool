import React, { useState, useMemo } from "react";
import { Box,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,TextField,Checkbox,IconButton,} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

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
  const [newName, setNewName] = useState<string>("");
  const [newDefaultTarget, setNewDefaultTarget] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const nextId = useMemo(() => getNextAvailableId(vertices), [vertices]);

  const handleAdd = (): void => {
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

  const handleDelete = (id: number): void => {
    setVertices((prev) => {
      const filtered = prev.filter((v) => v.id !== id).sort((a, b) => a.id - b.id);
      return filtered.map((v, idx) => ({ ...v, id: idx }));
    });
  };

  const toggleDefaultTarget = (id: number): void => {
    setVertices((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, defaultTarget: !v.defaultTarget } : v
      )
    );
  };

  
  return (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h5" 
        align="center" 
        sx={{ 
          mb: 4,
          fontWeight: 300,
          color: '#1e3a8a',
          letterSpacing: '0.5px'
        }}
      >
        Vertices
      </Typography>

      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell 
                sx={{ 
                  fontWeight: 500, 
                  width: 80,
                  color: '#475569',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #e2e8f0',
                  py: 2
                }}
              >
                ID
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 500,
                  color: '#475569',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #e2e8f0',
                  py: 2
                }}
              >
                Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 500, 
                  width: 140,
                  color: '#475569',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #e2e8f0',
                  py: 2,
                  textAlign: 'center'
                }}
              >
                Default Target
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 500, 
                  width: 90,
                  color: '#475569',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #e2e8f0',
                  py: 2
                }} 
                align="center"
              >
                <Add 
                  sx={{ 
                    color: '#3b82f6',
                    fontSize: '1.5rem'
                  }} 
                />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* ---------- add row ---------- */}
            <TableRow 
              sx={{ 
                backgroundColor: '#f0f9ff', 
                "& td": { 
                  borderBottom: '1px solid #e0f2fe',
                  py: 2
                },
                '&:hover': {
                  backgroundColor: '#e0f2fe'
                }
              }}
            >
              <TableCell>
                <TextField
                  disabled
                  value={nextId}
                  size="small"
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    width: "60px",
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#cbd5e1',
                        borderWidth: '1px'
                      },
                      '&.Mui-disabled fieldset': {
                        borderColor: '#e2e8f0'
                      }
                    }
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
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#cbd5e1',
                        borderWidth: '1px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#3b82f6'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                        borderWidth: '2px'
                      },
                      '&.Mui-error fieldset': {
                        borderColor: '#ef4444'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#94a3b8',
                      opacity: 1
                    }
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={newDefaultTarget}
                  onChange={(e) => setNewDefaultTarget(e.target.checked)}
                  sx={{
                    color: '#cbd5e1',
                    '&.Mui-checked': {
                      color: '#3b82f6'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.04)'
                    }
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  onClick={handleAdd}
                  sx={{
                    color: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.16)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Add />
                </IconButton>
              </TableCell>
            </TableRow>

            {error && (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 1 }}>
                  <Typography 
                    sx={{ 
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      pl: 1
                    }}
                  >
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* ---------- existing rows ---------- */}
            {vertices
              .slice() // don't mutate original
              .sort((a, b) => a.id - b.id)
              .map((v, index) => (
                <TableRow 
                  key={v.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f8fafc'
                    },
                    '& td': {
                      borderBottom: index === vertices.length - 1 ? 'none' : '1px solid #f1f5f9',
                      py: 2
                    }
                  }}
                >
                  <TableCell sx={{ 
                    color: '#64748b',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}>
                    {v.id}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#1e293b',
                    fontSize: '0.875rem'
                  }}>
                    {v.name}
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={!!v.defaultTarget}
                      onChange={() => toggleDefaultTarget(v.id)}
                      sx={{
                        color: '#cbd5e1',
                        '&.Mui-checked': {
                          color: '#3b82f6'
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(59, 130, 246, 0.04)'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      disabled
                      sx={{
                        color: '#cbd5e1',
                        mr: 0.5
                      }}
                    >
                      <Edit sx={{ fontSize: '1.125rem' }} />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(v.id)}
                      sx={{
                        color: '#64748b',
                        '&:hover': {
                          color: '#ef4444',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <Delete sx={{ fontSize: '1.125rem' }} />
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

export default VerticesTable;