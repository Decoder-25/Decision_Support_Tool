import { Box } from "@mui/material";
import InputFields from "../components/InputFields";
import DashboardHeader from "../components/DashboardHeader"; 
import Footer from "../components/Footer";
import AttackGraph from "../components/AttackGraph";
import { useLocation } from "react-router-dom";
export default function HomePage() {

  const location = useLocation();
  console.log('HomePage location.state =', location.state)
  const { vertices = [], edges = [] } = location.state || {}
  return (
    <Box>
      <DashboardHeader />
      <Box sx={{ display: 'flex', width: '100vw' }}>
        <Box sx={{ width: '50%' }}>
        <AttackGraph vertices={vertices} edges={edges} />
        </Box>
        <Box sx={{ width: '50%' }}>
          <InputFields />
        </Box>
      </Box>
      <Footer/>
    </Box>
  );
}