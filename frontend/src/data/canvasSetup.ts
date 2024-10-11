export type Unit = "mm" | "cm" | "inches" | "pixels";

// Maximum dimensions for the canvas
export const maxCanvasWidth = 1100;
export const maxCanvasHeight = 700;

// Conversion factors for different units to pixels
export const unitToPixels: Record<Unit, number> = {
  mm: 3.78, // 1 mm ≈ 3.78 pixels
  cm: 37.8, // 1 cm = 10 mm = 37.8 pixels
  inches: 96, // 1 inch = 96 pixels
  pixels: 1, // 1 pixel = 1 pixel
};

// Function to handle size selection and return updated canvas dimensions
export const handleSizeSelect = (
  size: string
): { width: number; height: number } | null => {
  console.log("Selected size:", size); // Debugging log to check the selected size

  // Use a regular expression to match width, height, and unit (e.g., "1920 x 1080 pixels")
  const sizeMatch = size.match(/(\d+)\s*x\s*(\d+)\s*(\w+)/);

  if (!sizeMatch) {
    console.error("Size format is incorrect.");
    return null;
  }

  // Extract the width, height, and unit
  const inputWidth = parseFloat(sizeMatch[1]);
  const inputHeight = parseFloat(sizeMatch[2]);
  const parsedUnit = sizeMatch[3].trim() as Unit; // Ensure the unit is of type 'Unit'

  console.log("Parsed dimensions:", { inputWidth, inputHeight, parsedUnit }); // Debugging log to check parsing

  const conversionFactor = unitToPixels[parsedUnit]; // Use the conversion factor for the selected unit
  console.log("Conversion factor:", conversionFactor); // Debugging log for conversion factor

  if (inputWidth && inputHeight && conversionFactor) {
    // Convert width and height to pixels
    const widthInPixels = inputWidth * conversionFactor;
    const heightInPixels = inputHeight * conversionFactor;

    console.log(
      "Width in pixels:",
      widthInPixels,
      "Height in pixels:",
      heightInPixels
    ); // Log converted values

    // Calculate the aspect ratio
    const aspectRatio = widthInPixels / heightInPixels;

    let newWidth = widthInPixels;
    let newHeight = heightInPixels;

    // Check if the width or height exceeds the maximum allowed values
    if (newWidth > maxCanvasWidth) {
      newWidth = maxCanvasWidth; // Limit the width
      newHeight = newWidth / aspectRatio; // Adjust the height to maintain aspect ratio
    }

    if (newHeight > maxCanvasHeight) {
      newHeight = maxCanvasHeight; // Limit the height
      newWidth = newHeight * aspectRatio; // Adjust the width to maintain aspect ratio
    }

    console.log("New dimensions:", { newWidth, newHeight }); // Log the new dimensions

    // Return the new canvas dimensions
    return { width: newWidth, height: newHeight };
  }

  return null; // Return null if there's an error
};
