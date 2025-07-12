// src/components/Footer.tsx

import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        width: "100%",
        background: "rgba(245,247,250,0.98)", // matches your page bg
        borderTop: "1px solid #e5eaf2",
        textAlign: "center",
        fontSize: "1rem",
        color: "#7b809a",
        boxShadow: "0 -2px 12px rgba(80,100,120,0.04)",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          letterSpacing: "0.01em",
          color: "#7b809a",
          fontWeight: 400,
        }}
      >
        © {new Date().getFullYear()} &nbsp;
        <span role="img" aria-label="heart" style={{ color: "#eb6f92" }}>
          with ♥ 
        </span>
        &nbsp;made by&nbsp;
        <Link
          href="https://github.com/Decoder-25/Decision_Support_Tool"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "#3b82f6",
            fontWeight: 500,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Disha Biswas
        </Link>
        .
      </Typography>
    </Box>
  );
}
