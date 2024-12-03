/**
 * Converts dimensions to pixels based on the provided unit.
 * @param value The dimension value to convert.
 * @param unit The unit of the dimension (px, mm, in).
 * @returns The value converted to pixels.
 */
export const convertToPixels = (value: number, unit: string): number => {
  const dpi = 96; // Standard DPI
  switch (unit) {
    case "mm":
      return (value / 25.4) * dpi; // 1 inch = 25.4 mm
    case "in":
      return value * dpi;
    case "px":
    default:
      return value; // Already in pixels
  }
};
