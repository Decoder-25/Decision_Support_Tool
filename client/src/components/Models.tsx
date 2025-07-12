// src/components/Models.tsx
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { listScenarios, deleteScenario } from "../api/ScenarioClient";

import type { ScenarioSummary } from "../api/ScenarioClient";

const Models: FC = () => {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch on mount
  useEffect(() => {
    listScenarios()
      .then((data) => {
        setScenarios(data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load scenarios.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Delete handler
  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this scenario?")) return;
    setDeletingId(id);

    deleteScenario(id)
      .then(() => {
        setScenarios((prev) => prev.filter((s) => s.id !== id));
      })
      .catch(() => {
        alert("Failed to delete scenario.");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (scenarios.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography>No scenarios found. Create one to get started!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Your Previous Scenarios
      </Typography>

      <Grid container spacing={3}>
        {scenarios.map((s) => (
          <Grid key={s.id} item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {s.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {s.id}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate("/page3", { state: { id: s.id } })}
                >
                  Open
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/page2",{ state: { id: s.id, fresh: true } })}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  disabled={deletingId === s.id}
                  onClick={() => handleDelete(s.id)}
                >
                  {deletingId === s.id ? "Deleting…" : "Delete"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Models;
