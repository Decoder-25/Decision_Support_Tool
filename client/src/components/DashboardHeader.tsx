import { Box, Typography, Chip } from "@mui/material";
import { Shield, Security, Timeline } from "@mui/icons-material";

function DashboardHeader() {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      py: 4,
      px: 3,
      minHeight: '200px'
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 150,
        height: 150,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        zIndex: 1
      }} />
      
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        position: 'relative',
        zIndex: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 2
        }}>
          <Box sx={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Security Configuration Dashboard
          </Typography>
        </Box>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            mb: 2,
            fontWeight: 300
          }}
        >
          Manage and monitor your organization's security posture
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<Security sx={{ color: 'white !important' }} />}
            label="Active Monitoring"
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          <Chip
            icon={<Timeline sx={{ color: 'white !important' }} />}
            label="Real-time Updates"
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardHeader;