// src/components/ModelName.tsx

import { Box, TextField, Typography } from "@mui/material";

interface ModelNameProps {
  modelName: string;
  onModelNameChange: (val: string) => void;
}

export default function ModelName({
  modelName,
  onModelNameChange,
}: ModelNameProps) {
  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Give your model a name
      </Typography>
      <TextField
        value={modelName}
        onChange={(e) => onModelNameChange(e.target.value)}
        placeholder="e.g. Acme Network Scenario"
        sx={{ width: "60%", maxWidth: 400 }}
      />
    </Box>
  );
}
