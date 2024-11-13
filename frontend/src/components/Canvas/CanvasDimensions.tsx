// CanvasDimensions.ts
import { convertToPx, UnitType } from "../../utils/unitConstants";

export const getCanvasDimensions = (
  width: number,
  height: number,
  unit: UnitType,
  maxDisplayHeight = 700
): { widthInPixels: number; heightInPixels: number; zoomLevel: number } => {
  // Convert dimensions to pixels
  const widthInPixels = convertToPx(width, unit);
  const heightInPixels = convertToPx(height, unit);

  // Calculate zoom level to ensure the canvas fits within maxDisplayHeight
  const zoomLevel =
    heightInPixels > maxDisplayHeight ? maxDisplayHeight / heightInPixels : 1;

  return {
    widthInPixels,
    heightInPixels,
    zoomLevel, // Include zoomLevel in the return value
  };
};
