// useShapeManagement.ts
import { useState } from "react";
import { Shape } from "./ShapeTypes"; // Import the Shape type

export const useShapeManagement = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);

  const addShape = (newShape: Shape) => {
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const selectShapeById = (id: number | null) => {
    setSelectedShapeId(id);
  };

  return {
    shapes,
    selectedShapeId,
    addShape,
    selectShapeById, // Ensure this is exported
  };
};
