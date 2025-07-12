// src/pages/HomePage.tsx
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Navbar       from "../components/Navbar";
import HeroSection  from "../components/HeroSection";
import Models       from "../components/Models";
import HowToUse     from "../components/HowToUse";
import Footer from "../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      {/* Give the section an id so Navbar can detect it */}
      <Box id="hero-section">
        <HeroSection onCreateNew={() => navigate("/page2")} />
      </Box>

      {/* ── Models (prev. scenarios) ──────────────────────────── */}
      <Box id="models-section">
        <Models />
      </Box>

      {/* ── How‑to‑use section (no id needed for navbar) ─────── */}
      <HowToUse />
      <Footer/>
    </Box>
  );
}
