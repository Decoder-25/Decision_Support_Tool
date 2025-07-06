// src/components/RightPanelTabs/TransparencyTab.tsx
import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function TransparencyTab() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transparency / Explanation
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Why These Controls?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pl: 2 }}>
          <Typography>• Firewall@2 blocks lateral movement</Typography>
          <Typography>• IDS@1 reduces default flow by 0.6</Typography>
          <Typography>• …</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
