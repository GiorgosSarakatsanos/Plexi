// UnitContext.tsx

import React, { createContext, useContext } from "react";
import { useUnitLogic } from "./useUnitLogic";
import { UnitContextType } from "./unitTypes";

// Create the UnitContext
const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { unit, setUnit, convertToPx } = useUnitLogic();

  return (
    <UnitContext.Provider value={{ unit, setUnit, convertToPx }}>
      {children}
    </UnitContext.Provider>
  );
};

// Custom hook for consuming the context
export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) throw new Error("useUnit must be used within a UnitProvider");
  return context;
};
