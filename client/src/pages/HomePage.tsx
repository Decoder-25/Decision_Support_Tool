import { Box } from "@mui/material";
import InputFields from "../components/InputFields";
import DashboardHeader from "../components/DashboardHeader"; // Add this import
import Footer from "../components/Footer";
import AttackGraph from "../components/AttackGraph";
export default function HomePage() {
  return (
    <Box>
      <DashboardHeader />
      <Box sx={{ display: 'flex', width: '100vw' }}>
        <Box sx={{ width: '50%' }}>
          <AttackGraph />
        </Box>
        <Box sx={{ width: '50%' }}>
          <InputFields />
        </Box>
      </Box>
      <Footer/>
    </Box>
  );
}