import { Box } from "@mui/material";
import InputFields from "../components/InputFields";
import DashboardHeader from "../components/DashboardHeader"; // Add this import
import Footer from "../components/Footer";
export default function HomePage() {
  return (
    <Box>
      <DashboardHeader />
      <InputFields />
      <Footer/>
    </Box>
  );
}