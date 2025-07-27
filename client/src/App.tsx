// src/App.tsx 
import { useRoutes } from "react-router-dom";
import AppRoute from "./config/app-route";
import { ScenarioBuilderProvider } from "./context/ScenarioBuilderContext";
import { OptimiserProvider } from "./context/OptimiserContext";

export default function App() {
  const element = useRoutes(AppRoute);
  return (
    <ScenarioBuilderProvider>
      <OptimiserProvider>
        {element}
      </OptimiserProvider>
    </ScenarioBuilderProvider>
  );
}
