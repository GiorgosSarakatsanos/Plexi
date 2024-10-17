import * as fabric from "fabric"; // Import the fabric library
import { useShapeTool } from "./ShapeTool"; // Centralized shape tool logic
import { shapeDataMap } from "./ShapeDataMap"; // Import the shape data map

export const useAddShape = (canvas: fabric.Canvas | undefined) => {
  const { addShape } = useShapeTool(canvas); // Use the general tool behavior

  const addShapeWithType = (shapeType: keyof typeof shapeDataMap) => {
    if (addShape) {
      addShape(shapeType); // Add the shape using the map logic
    }
  };

  return { addShapeWithType };
};
