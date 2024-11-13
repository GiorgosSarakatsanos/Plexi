// unitConstants.ts

// Define allowed unit types
export type UnitType = "px" | "mm" | "cm" | "in";

// Export conversion factors
export const conversionFactors = {
  px: 1, // Pixel to pixel is 1:1
  mm: 3.77953, // 1 mm ≈ 3.77953 pixels
  cm: 37.7953, // 1 cm ≈ 37.7953 pixels
  in: 96, // 1 inch ≈ 96 pixels
};

// Export a function to convert to pixels
export const convertToPx = (value: number, unit: UnitType): number => {
  return value * (conversionFactors[unit] || 1);
};
