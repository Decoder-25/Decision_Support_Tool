import {Box,Typography,} from "@mui/material";

export default function HomePage() {
  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: "#f6f8fa",
      py: 5,
    }}>
      <Typography variant="h4" fontWeight={700} align="center" mb={4} letterSpacing={1}>
        Cyber Security Investment Dashboard
      </Typography>
      
    </Box>
  );
}
