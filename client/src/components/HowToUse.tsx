// src/components/HowToUse.tsx
import {
  Box,
  Container,
  Grid, 
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";

const steps = [
  {
    Icon: PlaylistAddCheckOutlinedIcon,
    title: "Name your scenario",
    desc: "Give every new model a clear, memorable title so you can find it later.",
  },
  {
    Icon: AccountTreeOutlinedIcon,
    title: "Define nodes & targets",
    desc: "Add all key assets (vertices) and mark which ones an attacker must never reach.",
  },
  {
    Icon: SettingsOutlinedIcon,
    title: "Configure control groups",
    desc: "Select controls and set their levels to see how each option reduces risk.",
  },
  {
    Icon: DashboardCustomizeOutlinedIcon,
    title: "Optimise in the Dashboard",
    desc: "Run optimisation, compare costs, and download results for reporting.",
  },
];

const HowToUse = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        background:
          "linear-gradient(135deg, rgba(226,232,240,0.4) 0%, rgba(241,245,249,0.9) 100%)",
        py: { xs: 8, md: 4 },
        backdropFilter: "blur(4px)",
        mt: { xs: -4, md: -6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          How to Use the Tool
        </Typography>
        <Typography
          align="center"
          variant="body1"
          sx={{ color: "text.secondary", mb: 6 }}
        >
          A quick guide—four easy steps and you're ready to analyse.
        </Typography>

        {/* 2×2 grid */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {steps.map(({ Icon, title, desc }, i) => (
            <Grid key={title} size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    p: 1.5,
                    borderRadius: 2,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 28 }} />
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {i + 1}. {title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {desc}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Video placeholder */}
        <Box
          sx={{
            mt: 10,
            position: "relative",
            pt: "56.25%",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            backgroundColor: "#0f172a",
          }}
        >
          <Box
            component="iframe"
            src="" // YouTube embed
            title="Quick tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HowToUse;