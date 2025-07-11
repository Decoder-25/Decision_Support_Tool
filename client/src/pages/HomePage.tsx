import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Models from "../components/Models";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Navbar />

      {/* hero now renders full‑width itself, no Container or spacer needed */}
      <HeroSection onCreateNew={() => navigate("/page2")} />
      <Models/>

      {/* other sections go here */}
    </Box>
  );
}
