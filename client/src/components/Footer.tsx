import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ mt: 6, textAlign: 'center', py: 2 }}>
      <Typography variant="body2" sx={{ color: '#666' }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  );
};

export default Footer;
