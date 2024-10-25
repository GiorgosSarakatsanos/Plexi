// LayerProvider.tsx
import React, { createContext, useState, useCallback } from "react";
import { Shape } from "../Shape/ShapeTypes";
import { generateId } from "../../utils/idGenerator"; // Import ID generator

// Define the interface for context props
interface LayerContextProps {
  shapes: Shape[];
  selectedShapeId: number | null;
  addShape: (newShape: Omit<Shape, "id">) => void;
  selectShapeById: (id: number | null) => void;
  removeShapeById: (id: number) => void;
}

// Create the context
export const LayerContext = createContext<LayerContextProps | undefined>(
  undefined
);

export const LayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);

  const addShape = useCallback((newShape: Omit<Shape, "id">) => {
    setShapes((prevShapes) => {
      const shapeExists = prevShapes.some(
        (shape) =>
          shape.type === newShape.type && shape.position === newShape.position
      );
      if (!shapeExists) {
        const shapeWithId = { ...newShape, id: generateId() }; // Assign unique ID here
        console.log("Adding shape with ID:", shapeWithId.id); // Debug log
        return [...prevShapes, shapeWithId];
      }
      return prevShapes;
    });
  }, []);

  const selectShapeById = (id: number | null) => {
    setSelectedShapeId(id);
  };

  const removeShapeById = (id: number) => {
    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== id));
    if (selectedShapeId === id) {
      setSelectedShapeId(null);
    }
  };

  return (
    <LayerContext.Provider
      value={{
        shapes,
        selectedShapeId,
        addShape,
        selectShapeById,
        removeShapeById,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};
