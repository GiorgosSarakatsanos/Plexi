export const convertToPixels = (value: number, unit: string): number => {
  const pixelsPerInch = 96;
  switch (unit) {
    case "mm":
      return (value * pixelsPerInch) / 25.4;
    case "cm":
      return (value * pixelsPerInch) / 2.54;
    case "m":
      return value * pixelsPerInch * 39.37; // 1 meter = 39.37 inches
    case "inches":
      return value * pixelsPerInch;
    default:
      return value; // If already in pixels
  }
};

export const getCanvasDimensions = (
  width: number,
  height: number,
  unit: string
): { widthInPixels: number; heightInPixels: number } => {
  const widthInPixels = convertToPixels(width, unit);
  const heightInPixels = convertToPixels(height, unit);

  // Set the fixed canvas height to 700px
  const fixedCanvasHeight = 700;
  let adjustedHeight = fixedCanvasHeight;
  let adjustedWidth = (widthInPixels / heightInPixels) * fixedCanvasHeight;

  // If the width exceeds 1500px, reduce the height to maintain the aspect ratio
  if (adjustedWidth > 1500) {
    adjustedWidth = 1500;
    adjustedHeight = (heightInPixels / widthInPixels) * adjustedWidth;
  }

  return { widthInPixels: adjustedWidth, heightInPixels: adjustedHeight };
};
