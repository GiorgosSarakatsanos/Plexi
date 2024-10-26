import { useState } from "react";
import { Shape } from "./ShapeTypes"; // Import the Shape type

export const useShapeManagement = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // Update addShape to return the created shape
  const addShape = (newShape: Omit<Shape, "id">): Shape => {
    const shapeWithId: Shape = { ...newShape, id: Date.now().toString() }; // Convert to string
    setShapes((prevShapes) => [...prevShapes, shapeWithId]);
    return shapeWithId; // Return the created shape
  };

  const selectShapeById = (id: string | null) => {
    setSelectedShapeId(id);
  };

  return {
    shapes,
    selectedShapeId,
    addShape,
    selectShapeById,
  };
};
