import React from "react";
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Avatar
} from "@mui/material";

function SecurityCard({ title, value, onChange, icon, options  }) {
  return (
    <Card 
      sx={{ 
        mb: 3, 
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        },
        borderRadius: 3,
        border: '1px solid #f0f0f0'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                width: 40, 
                height: 40 
              }}
            >
              {icon}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              {title}
            </Typography>
          </Box>
          <Chip
            label={value}
            color={value === 'Advanced' ? 'success' : value === 'Basic' ? 'warning' : 'error'}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <FormControl fullWidth>
          <InputLabel>{title}</InputLabel>
          <Select
            value={value}
            label={title}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8f9fa',
                '&:hover': {
                  backgroundColor: '#fff',
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                }
              }
            }}
          >
            {options.length > 0 ? (
              options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ) : (
              // Default options if none provided
              <>
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </>
            )}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}

export default SecurityCard;