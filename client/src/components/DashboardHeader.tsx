import { Box, Typography } from "@mui/material";

function DashboardHeader() {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3,
      mb: 0
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
          Security Configuration Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Manage and monitor your organization's security posture
        </Typography>
      </Box>
    </Box>
  );
}

export default DashboardHeader;