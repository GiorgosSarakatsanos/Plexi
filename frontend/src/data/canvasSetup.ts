import * as fabric from "fabric";


// Define unit conversion outside to avoid re-creating it
export const unitConversion = {
  pixels: 1,
  mm: 3.78,
  cm: 37.8,
  inches: 96,
};

// Function to convert pixels to the selected unit
export const convertToUnit = (
  pixels: number,
  unit: keyof typeof unitConversion
) => {
  return (pixels / unitConversion[unit]).toFixed(2);
};

// Function to update the lines from the box to the canvas edges
export const updateLines = (
  canvas: fabric.Canvas,
  rect: fabric.Rect,
  width: number,
  height: number,
  unit: keyof typeof unitConversion,
  convertToUnitFunc: (
    pixels: number,
    unit: keyof typeof unitConversion
  ) => string,
  linesRef: React.MutableRefObject<fabric.Line[]>,
  setDistances: React.Dispatch<
    React.SetStateAction<{
      left: string;
      top: string;
      right: string;
      bottom: string;
    }>
  >
) => {
  // Clear existing lines
  linesRef.current.forEach((line) => canvas.remove(line));
  linesRef.current = [];

  const rectLeft = rect.left!;
  const rectTop = rect.top!;
  const rectRight = rect.left! + rect.width! * rect.scaleX!;
  const rectBottom = rect.top! + rect.height! * rect.scaleY!;

  // Calculate distances
  const leftDistance = rectLeft;
  const topDistance = rectTop;
  const rightDistance = width - rectRight;
  const bottomDistance = height - rectBottom;

  setDistances({
    left: convertToUnitFunc(leftDistance, unit),
    top: convertToUnitFunc(topDistance, unit),
    right: convertToUnitFunc(rightDistance, unit),
    bottom: convertToUnitFunc(bottomDistance, unit),
  });

  // Create lines for left, top, right, and bottom edges
  const leftLine = new fabric.Line(
    [
      rectLeft,
      rectTop + (rect.height! * rect.scaleY!) / 2,
      0,
      rectTop + (rect.height! * rect.scaleY!) / 2,
    ],
    { stroke: "pink", strokeDashArray: [5, 5], selectable: false }
  );
  canvas.add(leftLine);
  linesRef.current.push(leftLine);

  const topLine = new fabric.Line(
    [
      rectLeft + (rect.width! * rect.scaleX!) / 2,
      rectTop,
      rectLeft + (rect.width! * rect.scaleX!) / 2,
      0,
    ],
    { stroke: "pink", strokeDashArray: [5, 5], selectable: false }
  );
  canvas.add(topLine);
  linesRef.current.push(topLine);

  const rightLine = new fabric.Line(
    [
      rectRight,
      rectTop + (rect.height! * rect.scaleY!) / 2,
      width,
      rectTop + (rect.height! * rect.scaleY!) / 2,
    ],
    { stroke: "pink", strokeDashArray: [5, 5], selectable: false }
  );
  canvas.add(rightLine);
  linesRef.current.push(rightLine);

  const bottomLine = new fabric.Line(
    [
      rectLeft + (rect.width! * rect.scaleX!) / 2,
      rectBottom,
      rectLeft + (rect.width! * rect.scaleX!) / 2,
      height,
    ],
    { stroke: "pink", strokeDashArray: [5, 5], selectable: false }
  );
  canvas.add(bottomLine);
  linesRef.current.push(bottomLine);
};

// Function to handle distance change
export const handleDistanceChange = (
  side: "left" | "top" | "right" | "bottom",
  value: string,
  canvas: fabric.Canvas,
  width: number,
  height: number,
  unit: keyof typeof unitConversion,
  linesRef: React.MutableRefObject<fabric.Line[]>,
  setDistances: React.Dispatch<
    React.SetStateAction<{
      left: string;
      top: string;
      right: string;
      bottom: string;
    }>
  >
) => {
  const newDistance = parseFloat(value) * unitConversion[unit];
  const rect = canvas.getActiveObject() as fabric.Rect;

  if (rect) {
    if (side === "left") {
      rect.left = newDistance;
    } else if (side === "top") {
      rect.top = newDistance;
    } else if (side === "right") {
      rect.left = width - newDistance - rect.width! * rect.scaleX!;
    } else if (side === "bottom") {
      rect.top = height - newDistance - rect.height! * rect.scaleY!;
    }

    canvas.renderAll();
    updateLines(
      canvas,
      rect,
      width,
      height,
      unit,
      convertToUnit,
      linesRef,
      setDistances
    );
  }
};

export const handleSizeSelect = (
  size: string
): { width: number; height: number } | null => {
  // Your logic to parse and convert the selected size
  const sizeMatch = size.match(/(\d+)\s*x\s*(\d+)\s*(\w+)/);

  if (!sizeMatch) {
    console.error("Invalid size format.");
    return null;
  }

  const width = parseFloat(sizeMatch[1]);
  const height = parseFloat(sizeMatch[2]);

  return { width, height };
};
