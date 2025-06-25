import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import VerticesTable from "../components/VerticesTable"; // You will create this file next

function ScenarioBuilderPage() {
  // Vertices state (array of objects with id and name for now)
  const [vertices, setVertices] = useState([
    // Example: { id: 0, name: "start" }
  ]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Scenario Builder
      </Typography>
      <Box sx={{ mt: 4 }}>
        <VerticesTable vertices={vertices} setVertices={setVertices} />
      </Box>
    </Container>
  );
}

export default ScenarioBuilderPage;
