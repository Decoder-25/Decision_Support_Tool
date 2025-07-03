// src/components/Navbar.tsx

import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  // Map each label to its path
  const tabs = [
    { label: "Home", path: "/page1" },
    { label: "Models", path: "/page1" },      
    { label: "Builder", path: "/page2" },
    { label: "Dashboard", path: "/page3" },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 1px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",        
          minHeight: 72,
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 4,
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            borderRadius: "50px",
            padding: "8px 32px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            minWidth: "700px",
            justifyContent: "space-between",
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              component={Link}
              to={tab.path}
              disableRipple
              sx={{
                textTransform: "none",
                px: 3,
                py: 1.2,
                borderRadius: "50px",
                fontWeight: 500,
                fontSize: "0.95rem",
                letterSpacing: "0.02em",
                minWidth: "auto",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                color: pathname === tab.path ? "#fff" : "rgba(0, 0, 0, 0.7)",
                backgroundColor: pathname === tab.path ? "#1976d2" : "transparent",
                "&:hover": {
                  backgroundColor: pathname === tab.path ? "#1565c0" : "rgba(0, 0, 0, 0.04)",
                  transform: "translateY(-1px)",
                  boxShadow: pathname === tab.path ? "0 4px 12px rgba(25, 118, 210, 0.3)" : "none",
                },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}