import { useState } from "react";

// Define the Shape interface
interface Shape {
  id: number;
  type: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
}

// Define the Layer interface
interface Layer {
  id: number;
  name: string;
  type: string;
}

export const useShapeManagement = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);

  // Function to add a new shape with unique ID
  const addShape = (newShape: Shape, addLayer: (layer: Layer) => void) => {
    const uniqueId = shapes.length + 1;
    const shapeWithId = { ...newShape, id: uniqueId };

    setShapes((prevShapes) => [...prevShapes, shapeWithId]);

    // Create a new layer and pass it to addLayer
    addLayer({
      id: shapeWithId.id,
      name: `Layer ${shapeWithId.type} ${shapeWithId.id}`,
      type: shapeWithId.type,
    });

    // Set the new shape as the selected shape
    setSelectedShapeId(shapeWithId.id);
  };

  // Function to handle selection of a shape by its ID
  const selectShapeById = (id: number | null) => {
    setSelectedShapeId(id);
  };

  return {
    shapes,
    selectedShapeId,
    addShape,
    selectShapeById,
  };
};
