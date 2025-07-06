// src/components/RightPanelTabs/ParetoTab.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function ParetoTab() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Pareto Frontier
      </Typography>
      <Box
        sx={{
          height: 300,
          border: "1px dashed #cbd5e1",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
        }}
      >
        {/* TODO: Insert your chart component here */}
        Pareto frontier chart goes here
      </Box>
    </Box>
  );
}
