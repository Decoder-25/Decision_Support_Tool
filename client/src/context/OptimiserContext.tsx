import React, { createContext, useState, useContext } from "react";
import type { APIOptimiseResponse } from "../api/Optimise";

/* -------- public shape ---------------------------------------- */
interface CtxShape {
  /** last response (null = not run yet) */
  result: APIOptimiseResponse | null;
  /** setter the Optimiser tab will call */
  setResult: (r: APIOptimiseResponse | null) => void;
}

/* -------- react context --------------------------------------- */
const OptimiserCtx = createContext<CtxShape>({
  result: null,
  setResult: () => {},
});

/* -------- provider wrapper ------------------------------------ */
export const OptimiserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [result, setResult] = useState<APIOptimiseResponse | null>(null);
  return (
    <OptimiserCtx.Provider value={{ result, setResult }}>
      {children}
    </OptimiserCtx.Provider>
  );
};

/* -------- convenience hook ------------------------------------ */
export const useOptimiser = () => useContext(OptimiserCtx);
