import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { shapeMap } from "./ShapeMap";

// Define the shape's basic properties
interface Position {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  type: string;
  position: Position;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
}

// Custom hook to handle drawing shapes on the canvas
export const useKonvaMouseEvents = (
  selectedShape: string | null,
  addShape: (shape: Shape) => void
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  // Handle mouse down event (start drawing)
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();

    // If the selected tool is the "select" tool, we don't want to create a new shape
    if (selectedShape === "select") return;

    if (selectedShape && pointerPosition) {
      // Ensure the selected shape exists in the shape map
      const shapeProps = shapeMap[selectedShape];
      if (!shapeProps) {
        console.error(`Shape type "${selectedShape}" not found in shapeMap.`);
        return;
      }

      setIsDrawing(true);
      setStartPos(pointerPosition);
      const newShape: Shape = {
        id: 0, // Temporary ID, will be replaced later
        type: selectedShape,
        position: { x: pointerPosition.x, y: pointerPosition.y },
      };
      setCurrentShape(newShape);
    }
  };

  // Handle mouse move event (update shape dimensions/points as user drags)
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !startPos || !currentShape) return;

    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();
    if (!pointerPosition) return;

    // Ensure the selected shape exists in the shape map
    const shapeProps = shapeMap[currentShape.type];
    if (!shapeProps) {
      console.error(`Shape type "${currentShape.type}" not found in shapeMap.`);
      return;
    }

    // Call createShape from the shape map for the current shape
    const shapeData = shapeProps.createShape(startPos, pointerPosition);

    // Update the shape based on the shape type (rect, ellipse, line, triangle)
    const updatedShape: Shape = {
      ...currentShape, // Maintain the shape type and position
      ...shapeData, // Apply width/height for rectangles, points for lines, etc.
    };

    setCurrentShape(updatedShape); // Update the shape being drawn
  };

  // Handle mouse up event (finish drawing and save the shape)
  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      addShape(currentShape); // Add the finalized shape
      setIsDrawing(false);
      setCurrentShape(null); // Reset current shape after drawing is done
      setStartPos(null);
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentShape, // Track the current shape being drawn
  };
};
