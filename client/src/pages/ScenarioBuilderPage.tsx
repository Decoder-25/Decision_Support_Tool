
import { useState } from "react";
import { styled } from "@mui/material/styles";
import StepConnector, {stepConnectorClasses,} from "@mui/material/StepConnector";
import { Container,Box,Typography,Stepper,Step,StepLabel,Button,} from "@mui/material";
import VerticesTable from "../components/VerticesTable";
import type { Vertex } from "../components/VerticesTable";
import ControlGroupsTable from "../components/ControlGroupsTable";
import type { ControlGroup } from "../components/ControlGroupsTable";
import ControlLevelsTable from "../components/ControlLevelsTable";
import type { ControlLevel } from "../components/ControlLevelsTable";
import EdgesTable from "../components/EdgesTable";
import type { Edge } from "../types/edgesTablesTypes";
import { useNavigate } from "react-router-dom"; 
const steps = ["Vertices", "Control groups", "Control levels", "Edges"];
const SpacedConnector = styled(StepConnector)(() => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#e0e0e0",
    borderTopWidth: 2,
    margin: "0 24px",
  },
}));

export default function ScenarioBuilderPage() {
    const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [controlGroups, setControlGroups] = useState<ControlGroup[]>([]);
  const [controlLevels, setControlLevels] = useState<ControlLevel[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);


  const handleNext = () => {
    if (activeStep === steps.length - 1) {
        // Final step — navigate
        console.log({ vertices, controlLevels, controlGroups, edges });

        navigate("/page1", {
          state: { vertices, controlGroups, controlLevels, edges },
        });
      } else {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
      }
  };
  
  const handleBack = () =>
    setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Scenario Builder
      </Typography>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<SpacedConnector />}
        sx={{ px: 2 }}
      >
        {steps.map((label) => (
          <Step key={label} sx={{ flex: 1 }}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <VerticesTable vertices={vertices} setVertices={setVertices} />
        )}

        {activeStep === 1 && (
          <ControlGroupsTable
            controlGroups={controlGroups}
            setControlGroups={setControlGroups}
          />
        )}

        {activeStep === 2 && (
          <Typography align="center" color="textSecondary">
            <ControlLevelsTable 
            controlLevels={controlLevels} 
            setControlLevels={setControlLevels} 
            />
          </Typography>
        )}

        {activeStep === 3 && (
          <Typography align="center" color="textSecondary">
            <EdgesTable
            vertices={vertices}
            controlGroups={controlGroups}
            edges={edges}
            setEdges={setEdges}
            />
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"  
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}
