import { Box, TextField, Typography, InputAdornment } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Edit } from "@mui/icons-material";

interface ModelNameProps {
  modelName: string;
  onModelNameChange: (val: string) => void;
}

const PRIMARY_BLUE = "#3B71CA";

const CleanTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(PRIMARY_BLUE, 0.4),
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: PRIMARY_BLUE,
        borderWidth: '2px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(PRIMARY_BLUE, 0.2),
      transition: 'all 0.2s ease-in-out',
    },
    '& input': {
      padding: '16px 20px',
      fontSize: '16px',
      fontWeight: 500,
      '&::placeholder': {
        color: '#9CA3AF',
        opacity: 1,
        fontWeight: 400,
      },
    },
  },
  '& .MuiInputLabel-root': {
    display: 'none',
  },
}));

export default function ModelName({
  modelName,
  onModelNameChange,
}: ModelNameProps) {
  return (
    <Box sx={{ 
      mb: 4, 
      textAlign: 'center',
      maxWidth: 500,
      mx: 'auto'
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#374151',
          fontWeight: 600,
          fontSize: '18px',
          mb: 1
        }}
      >
        Model Name
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#6B7280',
          mb: 3,
          fontSize: '14px',
          fontWeight: 400
        }}
      >
        Enter a descriptive name for your scenario
      </Typography>

      <CleanTextField
        value={modelName}
        onChange={(e) => onModelNameChange(e.target.value)}
        placeholder="e.g. Acme Network Scenario"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Edit sx={{ 
                color: '#9CA3AF',
                fontSize: 18
              }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}