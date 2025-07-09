// src/context/ScenarioBuilderContext.tsx
import React, {
      createContext,
      useContext,
      useState,
      type Dispatch,
      type SetStateAction,
    } from "react";
  import type { ReactNode } from "react";
  import type { Vertex } from "../components/VerticesTable";
  import type { ControlGroup } from "../components/ControlGroupsTable";
  import type { ControlLevel } from "../components/ControlLevelsTable";
  import type { Edge } from "../types/edgesTablesTypes";
  
  interface ScenarioBuilderState {
    modelName: string;
    setModelName: Dispatch<SetStateAction<string>>;
    vertices: Vertex[];
    setVertices: Dispatch<SetStateAction<Vertex[]>>;
    controlGroups: ControlGroup[];
    setControlGroups: Dispatch<SetStateAction<ControlGroup[]>>;
    controlLevels: ControlLevel[];
    setControlLevels: Dispatch<SetStateAction<ControlLevel[]>>;
    edges: Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    activeStep: number;
    setActiveStep: Dispatch<SetStateAction<number>>;
  }
  
  const ScenarioBuilderContext = createContext<ScenarioBuilderState | undefined>(
    undefined
  );
  
  export function ScenarioBuilderProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [modelName, setModelName] = useState("");
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [controlGroups, setControlGroups] = useState<ControlGroup[]>([]);
    const [controlLevels, setControlLevels] = useState<ControlLevel[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [activeStep, setActiveStep] = useState(0);
  
    return (
      <ScenarioBuilderContext.Provider
        value={{
          modelName,
          setModelName,
          vertices,
          setVertices,
          controlGroups,
          setControlGroups,
          controlLevels,
          setControlLevels,
          edges,
          setEdges,
          activeStep,
          setActiveStep,
        }}
      >
        {children}
      </ScenarioBuilderContext.Provider>
    );
  }
  
  export function useScenarioBuilder() {
    const ctx = useContext(ScenarioBuilderContext);
    if (!ctx)
      throw new Error(
        "useScenarioBuilder must be used within a ScenarioBuilderProvider"
      );
    return ctx;
  }
  