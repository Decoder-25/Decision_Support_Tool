// src/pages/ModelHubPage.tsx
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Avatar,
  
  Paper,
  Divider,
} from "@mui/material";
import {
  Security,
  PlayArrow,
  Add,
  FolderOpen,
  Timeline,
  Shield,
  Assessment,
  TrendingUp,
  Speed,
  VerifiedUser,
  Analytics,
} from "@mui/icons-material";

export default function HomePage() {
  // Hard‑coded for now
  const templates = [
    {
      id: "tmpl1",
      name: "Quick‑start Template",
      description: "Get going in seconds with a predefined scenario",
    },
  ];
  const scenarios = [
    { id: "scn1", name: "My First Scenario", updatedAt: "30/06/2025" },
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      pb: 8
    }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* HERO */}
        <Paper
          elevation={24}
          sx={{
            textAlign: "center",
            py: 8,
            px: 6,
            mb: 8,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '2rem'
              }}
            >
              <Security fontSize="large" />
            </Avatar>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Decision Support Tool
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              paragraph
              sx={{ 
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
                mb: 4
              }}
            >
              Translate complex cyber‑security optimisation into clear, actionable
              investment plans.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
              <Chip 
                icon={<Speed />} 
                label="Fast Analysis" 
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                  color: '#667eea',
                  fontWeight: 500
                }}
              />
              <Chip 
                icon={<VerifiedUser />} 
                label="Risk Assessment" 
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(118, 75, 162, 0.3)',
                  color: '#764ba2',
                  fontWeight: 500
                }}
              />
              <Chip 
                icon={<Analytics />} 
                label="Smart Optimization" 
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                  color: '#667eea',
                  fontWeight: 500
                }}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => console.log("→ New Scenario")}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Create New Scenario
            </Button>
          </Box>
        </Paper>

        {/* TEMPLATES */}
        {templates.length > 0 && (
          <>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: 'white', 
                fontWeight: 600,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Timeline /> Start from a template
            </Typography>
            <Grid container spacing={3} mb={8}>
              {templates.map((t) => (
                <Grid item xs={12} sm={6} md={4} key={t.id}>
                  <Card
                    elevation={12}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            mr: 2
                          }}
                        >
                          <PlayArrow />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {t.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {t.description}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PlayArrow />}
                        onClick={() => console.log("→ Use template", t.id)}
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: '#667eea',
                            background: 'rgba(102, 126, 234, 0.1)',
                          }
                        }}
                      >
                        Use Template
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* EXISTING SCENARIOS */}
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: 'white', 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <FolderOpen /> Your scenarios
        </Typography>
        {scenarios.length ? (
          <Grid container spacing={3} mb={8}>
            {scenarios.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                <Card
                  elevation={12}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          mr: 2
                        }}
                      >
                        <Assessment />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {s.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {s.updatedAt}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<FolderOpen />}
                      onClick={() => console.log("→ Open", s.id)}
                      sx={{
                        borderColor: '#764ba2',
                        color: '#764ba2',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: '#764ba2',
                          background: 'rgba(118, 75, 162, 0.1)',
                        }
                      }}
                    >
                      Open Scenario
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={8}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 8
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
              No scenarios yet. Create one above!
            </Typography>
          </Paper>
        )}

        {/* HOW IT WORKS */}
        <Paper
          elevation={24}
          sx={{
            p: 6,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <TrendingUp /> How it works
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { icon: <Shield />, text: "Define your scenario: assets, vulnerabilities, controls.", color: '#667eea' },
              { icon: <Timeline />, text: "Build your attack graph & control levels.", color: '#764ba2' },
              { icon: <Analytics />, text: "Run optimisation and explore risk–cost trade‑offs.", color: '#667eea' },
              { icon: <Assessment />, text: "Save, share, or edit your scenario at any time.", color: '#764ba2' }
            ].map((step, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: step.color,
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ color: step.color, mr: 1 }}>{step.icon}</Box>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {step.text}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Placeholder for a future tutorial video */}
          <Paper
            elevation={4}
            sx={{
              mt: 4,
              width: "100%",
              height: 0,
              paddingBottom: "56.25%" /* 16:9 */,
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '2px dashed rgba(102, 126, 234, 0.3)'
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: 'center'
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <PlayArrow fontSize="large" />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  fontWeight: 500
                }}
              >
                Tutorial Video Coming Soon
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Learn how to maximize your security investments
              </Typography>
            </Box>
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
}