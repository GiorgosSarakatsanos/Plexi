// unitTypes.ts

import { UnitType } from "./unitConstants";

export interface UnitContextType {
  unit: UnitType;
  setUnit: (unit: UnitType) => void;
  convertToPx: (value: number) => number;
}

// Export UnitType if needed elsewhere
export type { UnitType };
