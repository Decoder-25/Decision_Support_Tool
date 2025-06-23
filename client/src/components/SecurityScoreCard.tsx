import React from "react";
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Chip, 
  LinearProgress 
} from "@mui/material";

function SecurityScoreCard({ score }) {
  return (
    <Card 
      sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Overall Security Score
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Current security implementation level
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {score}%
            </Typography>
            <Chip
              label={score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
              sx={{
                bgcolor: score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: 12,
            borderRadius: 6,
            bgcolor: 'rgba(255,255,255,0.2)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'white',
              borderRadius: 6
            }
          }}
        />
      </CardContent>
    </Card>
  );
}

export default SecurityScoreCard;