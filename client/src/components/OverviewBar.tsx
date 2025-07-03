// src/components/OverviewBar.tsx

import { Box, Typography, Button, Chip, } from "@mui/material";

interface OverviewBarProps {
  modelName: string;
  lastSaved: string;
  onSave: () => void;
  onBack: () => void;
  securityScore?: number;            // 0–100
  scoreLabel?: string;               // e.g. "Needs Improvement"
}

export default function OverviewBar({
  modelName,
  lastSaved,
  onSave,
  onBack,
  securityScore = 80,
  scoreLabel = "",
}: OverviewBarProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 75) return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    if (score >= 40) return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
    return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        px: 3,
        py: 2.5,
        borderRadius: 2,
        mb: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
        },
      }}
    >
      {/* Model name + last saved */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#6b7280",
              letterSpacing: "0.5px",
            }}
          >
            MODEL NAME
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "#d1d5db",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            fontSize: "1.5rem",
            fontFamily: "monospace",
            backgroundColor: "#3b82f6",
            color: "white",
            px: 3,
            py: 1,
            borderRadius: 2,
            display: "inline-block",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
            border: "2px solid #2563eb",
          }}
        >
          {modelName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              display: "inline-block",
            }}
          />
          Last saved: {lastSaved}
        </Typography>
      </Box>

      {/* Modern Security Score */}
      <Box sx={{ textAlign: "center", flex: "0 0 280px" }}>
        <Typography
          variant="subtitle2"
          sx={{ 
            color: "#6b7280", 
            mb: 1.5, 
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase"
          }}
        >
          Overall Security Score
        </Typography>
        
        {/* Circular Progress Design */}
        <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `conic-gradient(${getScoreColor(securityScore)} ${securityScore * 3.6}deg, #f3f4f6 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: 75,
                height: 75,
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.1)",
              }
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: "1.75rem",
                  background: getScoreGradient(securityScore),
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  mb: 0.5
                }}
              >
                {securityScore}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px"
                }}
              >
                SCORE
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Score Label Chip */}
        {scoreLabel && (
          <Box sx={{ mb: 1 }}>
            <Chip
              label={scoreLabel}
              color={securityScore >= 75 ? "success" : securityScore >= 40 ? "warning" : "error"}
              size="small"
              sx={{ 
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 24,
                borderRadius: 3,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                "& .MuiChip-label": {
                  px: 1.5,
                }
              }}
            />
          </Box>
        )}


      </Box>

      {/* Back / Save buttons */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            borderColor: "#d1d5db",
            color: "#6b7280",
            fontWeight: 500,
            px: 2.5,
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: "0.875rem",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
              color: "#374151",
            },
          }}
        >
          ← Back to Builder
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          sx={{
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: 500,
            px: 2.5,
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: "0.875rem",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#2563eb",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          💾 Save Model
        </Button>
      </Box>
    </Box>
  );
}