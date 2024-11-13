// useUnitLogic.ts

import { useState } from "react";
import { conversionFactors, UnitType } from "./unitConstants"; // Import constants

export const useUnitLogic = () => {
  const [unit, setUnit] = useState<UnitType>("px");

  const convertToPx = (value: number): number =>
    value * conversionFactors[unit];

  return { unit, setUnit, convertToPx };
};
