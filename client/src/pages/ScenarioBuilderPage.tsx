// src/pages/ScenarioBuilderPage.tsx
import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Chip,
  Fade,
  Snackbar,
  Alert, 
  Toolbar,
} from "@mui/material";
import {
  AccountTree,
  Group,
  Settings,
  Link as LinkIcon,
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";
import type { StepIconProps } from "@mui/material/StepIcon";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ModelName from "../components/ModelName";
import VerticesTable from "../components/VerticesTable";

import ControlGroupsTable from "../components/ControlGroupsTable";

import ControlLevelsTable from "../components/ControlLevelsTable";

import EdgesTable from "../components/EdgesTable";

import { useScenarioBuilder } from "../context/ScenarioBuilderContext";

const PRIMARY_BLUE = "#3B71CA";

const steps = [
  { label: "Vertices", icon: AccountTree },
  { label: "Control groups", icon: Group },
  { label: "Control levels", icon: Settings },
  { label: "Edges", icon: LinkIcon },
];

const ModernConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: 0,
      background: `linear-gradient(90deg, ${PRIMARY_BLUE} 0%, ${alpha(
        PRIMARY_BLUE,
        0.7
      )} 100%)`,
      transition: "width 0.5s ease-in-out",
    },
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}::before`]: {
    width: "100%",
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}::before`]: {
    width: "100%",
  },
}));

const ModernStepIconRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "ownerState",
})<{ ownerState: { completed: boolean; active: boolean } }>(
  ({ ownerState }) => ({
    backgroundColor:
      ownerState.completed || ownerState.active ? PRIMARY_BLUE : "#e0e0e0",
    color: "#fff",
    width: 40,
    height: 40,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: ownerState.active
      ? `0 0 0 4px ${alpha(PRIMARY_BLUE, 0.2)}`
      : "none",
    transform: ownerState.active ? "scale(1.1)" : "scale(1)",
    transition: "all 0.3s ease-in-out",
  })
);

function ModernStepIcon(props: StepIconProps) {
  const { active = false, completed = false, icon } = props;
  const index = Number(icon) - 1;
  const IconComponent = steps[index]?.icon;
  if (!IconComponent) return null;
  return (
    <ModernStepIconRoot ownerState={{ completed, active }}>
      {completed ? (
        <CheckCircle fontSize="small" />
      ) : (
        <IconComponent fontSize="small" />
      )}
    </ModernStepIconRoot>
  );
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3, 0),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  border: `1px solid ${theme.palette.divider}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${PRIMARY_BLUE} 0%, ${alpha(
      PRIMARY_BLUE,
      0.7
    )} 100%)`,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 4),
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 8px 25px ${alpha(PRIMARY_BLUE, 0.3)}`,
  },
}));
const PrimaryButton = styled(ActionButton)(() => ({
  backgroundColor: PRIMARY_BLUE,
  color: "#fff",
  "&:hover": { backgroundColor: alpha(PRIMARY_BLUE, 0.9) },
}));
const SecondaryButton = styled(ActionButton)(() => ({
  border: `1px solid ${PRIMARY_BLUE}`,
  color: PRIMARY_BLUE,
  "&:hover": { backgroundColor: alpha(PRIMARY_BLUE, 0.05) },
}));

const StepContent = styled(Box)(() => ({
  minHeight: 360,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

export default function ScenarioBuilderPage() {
  const navigate = useNavigate();
   const {
        activeStep, setActiveStep,
        modelName, setModelName,
        vertices, setVertices,
        controlGroups, setControlGroups,
        controlLevels, setControlLevels,
        edges, setEdges,
      } = useScenarioBuilder();
    

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");


  useEffect(() => {
    const maxByGroup = new Map<string, number>();
    controlGroups.forEach((g) => {
      maxByGroup.set(g.id, g.levels.length);
    });
  
    setControlLevels((prev) => {
      const newLevels = prev.filter((lvl) => {
        const max = maxByGroup.get(lvl.groupId) ?? 0;
        return lvl.level <= max;
      });
  
      const removed = prev.length - newLevels.length;
      if (removed > 0) {
        setToastMsg(
          `Removed ${removed} control level${removed > 1 ? 's' : ''} because group settings were updated.`
        );
        setToastOpen(true);
        return newLevels;
      }
  
      return prev;
    });
  }, [controlGroups]); 
  

  const handleNext = () => {
    if (activeStep === 0 && !modelName.trim()) {
      alert("Please enter a model name before continuing.");
      return;
    }
    if (activeStep === steps.length - 1) {
      navigate("/page3", {
        state: { modelName, vertices, controlGroups, controlLevels, edges },
      });
    } else {
      setActiveStep((p) => p + 1);
    }
  };
  const handleBack = () => setActiveStep((p) => p - 1);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 5 }}>
      <Navbar />
      <Toolbar/>

      <Box sx={{ textAlign: "center", mb: 6, mt: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${PRIMARY_BLUE} 0%, ${alpha(
              PRIMARY_BLUE,
              0.7
            )} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Scenario Builder
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Create and configure your model scenario step by step
        </Typography>
      </Box>

      <ModelName modelName={modelName} onModelNameChange={setModelName} />

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip
          label={`Step ${activeStep + 1} of ${steps.length}`}
          size="small"
          sx={{
            bgcolor: alpha(PRIMARY_BLUE, 0.1),
            color: PRIMARY_BLUE,
            fontWeight: 600,
          }}
        />
      </Box>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<ModernConnector />}
        sx={{ mb: 4 }}
      >
        {steps.map((s, i) => (
          <Step key={s.label}>
            <StepLabel
              slots={{ stepIcon: ModernStepIcon }}
              sx={{
                "& .MuiStepLabel-label": {
                  mt: 1,
                  fontWeight: activeStep === i ? 600 : 400,
                  color:
                    activeStep === i ? PRIMARY_BLUE : "text.secondary",
                  fontSize: "0.95rem",
                },
              }}
            >
              {s.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <StyledPaper elevation={0}>
        <Fade in timeout={500}>
          <StepContent>
            {activeStep === 0 && (
              <VerticesTable
                vertices={vertices}
                setVertices={setVertices}
              />
            )}
            {activeStep === 1 && (
              <ControlGroupsTable
                controlGroups={controlGroups}
                setControlGroups={setControlGroups}
              />
            )}
            {activeStep === 2 && (
              <ControlLevelsTable
              controlGroups={controlGroups}
                controlLevels={controlLevels}
                setControlLevels={setControlLevels}
              />
            )}
            {activeStep === 3 && (
              <EdgesTable
                vertices={vertices}
                controlGroups={controlGroups}
                edges={edges}
                setEdges={setEdges}
              />
            )}
          </StepContent>
        </Fade>
      </StyledPaper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
        }}
      >
        <SecondaryButton
          disabled={activeStep === 0}
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Back
        </SecondaryButton>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {activeStep === steps.length - 1
              ? "Ready to finish"
              : "Continue to next step"}
          </Typography>
          <PrimaryButton
            onClick={handleNext}
            endIcon={
              activeStep === steps.length - 1 ? (
                <CheckCircle />
              ) : (
                <ArrowForward />
              )
            }
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </PrimaryButton>
        </Box>
      </Box>
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
