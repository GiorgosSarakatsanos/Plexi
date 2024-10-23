import { useState } from "react";
import { Shape } from "./ShapeProps"; // Import from the shared file

// Define the Layer interface
interface Layer {
  id: number;
  name: string;
  type: string;
}

export const useShapeManagement = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);

  // Function to add a new shape with a unique ID
  const addShape = (
    newShape: Omit<Shape, "id">,
    addLayer: (layer: Layer) => void
  ) => {
    const uniqueId = shapes.length + 1;
    const shapeWithId: Shape = { ...newShape, id: uniqueId }; // Assign unique ID here

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
