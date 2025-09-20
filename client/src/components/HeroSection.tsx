// src/components/HeroSection.tsx
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  alpha,
  keyframes,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AnalyticsIcon from "@mui/icons-material/Analytics";

import heroBg from "../assets/Background.png";

// fade‑in animation for the shield icon
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

interface HeroSectionProps {
  onCreateNew: () => void;
}

export default function HeroSection({ onCreateNew }: HeroSectionProps) {
  // chip background styles
  const chipBg  = alpha("#ffffff", 0.10);
  const chipBgH = alpha("#ffffff", 0.18);
  const chipBrd = alpha("#ffffff", 0.28);

  // ensure icon prop is a ReactElement
  const features: [string, React.ReactElement][] = [
    ["Fast Analysis", <SpeedIcon />],
    ["Risk Assessment", <VerifiedUserIcon />],
    ["Smart Optimisation", <AnalyticsIcon />],
  ];

  return (
    <Box
      sx={{
        minHeight: "72vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        color: "#fff",
        py: { xs: 8, md: 12 },

        // background image with dark overlay
        backgroundColor: "rgba(0,0,0,0.35)",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 900, px: 3 }}>
        <SecurityIcon
          sx={{
            fontSize: 64,
            mb: 2,
            opacity: 0.95,
            animation: `${fadeIn} 0.8s ease-out both`,
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: -1,
            mb: 2,
            fontSize: { xs: "2.4rem", md: "3.4rem" },
            textShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          Decision Support Tool
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            fontWeight: 400,
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Effortlessly build, analyse, and optimise your cyber security strategy.
        </Typography>

        <Typography
          sx={{
            mb: 4,
            color: "#ffffff",
            fontWeight: 400,
            maxWidth: 580,
            mx: "auto",
            fontSize: { xs: "1rem", md: "1.15rem" },
            textShadow: "0 1px 6px rgba(0,0,0,0.10)",
          }}
        >
          Visualise vulnerabilities, try security controls, and discover the
          smartest investments — no expertise required.
        </Typography>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          {features.map(([label, icon]) => (
            <Chip
              key={label}
              icon={icon}
              label={label}
              sx={{
                px: 1.5,
                backdropFilter: "blur(6px)",
                backgroundColor: chipBg,
                border: `1px solid ${chipBrd}`,
                color: "#fff",
                "& .MuiChip-icon, & .MuiChip-icon svg": { color: "#fff" },
                "&:hover": {
                  backgroundColor: chipBgH,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </Stack>

        <Button
          onClick={onCreateNew}
          size="large"
          sx={{
            px: 6,
            py: 2,
            fontSize: "1.05rem",
            fontWeight: 700,
            borderRadius: 3,
            textTransform: "none",
            color: "#6a5af9",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",

            "&:hover": {
              backgroundColor: alpha("#ffffff", 0.9),
            },
            transition: "all 0.25s cubic-bezier(.4,0,0.2,1)",
          }}
        >
          + Create New Scenario
        </Button>
      </Box>
    </Box>
  );
}
