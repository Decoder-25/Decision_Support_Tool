// src/components/Models.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Fade,
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/Grid"; 
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";

import { listScenarios, deleteScenario } from "../api/ScenarioClient";
import type { ScenarioSummary } from "../api/ScenarioClient";

const Models = () => {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10; // 5 cards per row × 2 rows = 10 cards per page
  const navigate = useNavigate();

  // Fetch once
  useEffect(() => {
    listScenarios()
      .then((data) => {
        setScenarios(data);
        setError(null);
      })
      .catch(() => setError("Failed to load scenarios."))
      .finally(() => setLoading(false));
  }, []);

  // Delete handler
  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this scenario?")) return;
    setDeletingId(id);
    deleteScenario(id)
      .then(() => setScenarios((prev) => prev.filter((s) => s.id !== id)))
      .catch(() => alert("Failed to delete scenario."))
      .finally(() => setDeletingId(null));
  };

  // Loading / error / empty
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <CircularProgress size={50} thickness={4} sx={{ color: "primary.main" }} />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <Typography variant="h6" sx={{ color: "text.primary", textAlign: "center" }}>
          {error}
        </Typography>
      </Box>
    );
  }
  if (scenarios.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "text.primary", mb: 2, fontWeight: 300, textAlign: "center" }}
        >
          No scenarios yet
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
          Create your first scenario to get started
        </Typography>
      </Box>
    );
  }

  // Filter & paginate
  const filtered = scenarios.filter((s) =>
    s.name.toLowerCase().includes(filter.toLowerCase().trim())
  );
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "100vh",
        pt: { xs: 4, md: 6 },
       
      }}
    >
      <Container maxWidth="lg">
        {/* Header & search */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1a202c",
              mb: 3,
              fontSize: { xs: "2.25rem", md: "3rem" },
              letterSpacing: "-0.05em",
              lineHeight: 1.2,
            }}
          >
            Your Previous Scenarios
          </Typography>
          <Chip
            label={`${scenarios.length} scenario${scenarios.length !== 1 ? "s" : ""}`}
            variant="outlined"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#3b82f6",
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              boxShadow: "0 1px 3px rgba(59, 130, 246, 0.1)",
            }}
          />
        </Box>

        <Box sx={{ textAlign: "center", mb: 5 }}>
          <TextField
            variant="outlined"
            size="medium"
            placeholder="Search scenarios..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            sx={{
              width: { xs: "100%", sm: 400 },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
                "& fieldset": { border: "none" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Grid of cards */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ justifyContent: "center" }}>
          {paged.map((s, idx) => (
            <Grid key={s.id} xs={12} sm={6} md={4} lg={2}>
              <Fade in timeout={300 + idx * 100}>
                <Card
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    backgroundColor: "white",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.4,
                        color: "text.primary",
                        mb: 2,
                        fontSize: "1.1rem",
                      }}
                    >
                      {s.name}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      justifyContent: "center",
                      gap: 1,
                      p: 2,
                      backgroundColor: "#f8fafc",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    <Tooltip title="View" arrow>
                      <IconButton
                        onClick={() => navigate("/page3", { state: { id: s.id } })}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "primary.main",
                            backgroundColor: "primary.light",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        onClick={() => navigate("/page2", { state: { id: s.id, fresh: true } })}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "warning.main",
                            backgroundColor: "warning.light",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        disabled={deletingId === s.id}
                        onClick={() => handleDelete(s.id)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "error.main",
                            backgroundColor: "error.light",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(filtered.length / perPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>

        {/* No results */}
        {filtered.length === 0 && filter.trim() && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}>
              No scenarios found
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Try adjusting your search
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Models;