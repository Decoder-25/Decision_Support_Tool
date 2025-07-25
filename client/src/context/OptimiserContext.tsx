import React, { createContext, useState, useContext } from "react";
import type { APIOptimiseResponse } from "../api/Optimise";

/* ---------- public shape ----------------------------------- */
interface CtxShape {
  result   : APIOptimiseResponse | null;   // last optimiser run
  setResult: (r: APIOptimiseResponse | null) => void;

  baseline : number | null;                // “risk with no controls” (0‑budget run)
  setBaseline : (n: number | null) => void;
}

/* ---------- create ----------------------------------------- */
const OptimiserCtx = createContext<CtxShape>({
  result: null,        setResult : () => {},
  baseline: null,      setBaseline: () => {},
});

/* ---------- provider --------------------------------------- */
export const OptimiserProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [result,   setResult]   = useState<APIOptimiseResponse | null>(null);
  const [baseline, setBaseline] = useState<number | null>(null);

  return (
    <OptimiserCtx.Provider value={{ result, setResult, baseline, setBaseline }}>
      {children}
    </OptimiserCtx.Provider>
  );
};

/* ---------- hook ------------------------------------------- */
export const useOptimiser = () => useContext(OptimiserCtx);
