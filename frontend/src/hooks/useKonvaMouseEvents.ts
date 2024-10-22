import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { shapeMap } from "../components/Shape/ShapeMap";
import Konva from "konva";

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

export const useKonvaMouseEvents = (
  selectedShape: string | null,
  addShape: (shape: Shape) => void,
  stageRef: React.RefObject<Konva.Stage> // Add a reference to the stage
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();

    if (selectedShape === "select") {
      // If the select tool is active, make all shapes draggable
      const shapes = stageRef.current?.find("Shape"); // Find all shapes
      shapes?.forEach((shape) => shape.draggable(true));
    } else if (selectedShape && shapeMap[selectedShape]) {
      // If a drawing tool is selected, reset all shapes to non-draggable
      const shapes = stageRef.current?.find("Shape"); // Find all shapes
      shapes?.forEach((shape) => shape.draggable(false));

      // Create a new shape
      if (pointerPosition) {
        setIsDrawing(true);
        setStartPos(pointerPosition);
        const newShape: Shape = {
          id: Date.now(),
          type: selectedShape,
          position: { x: pointerPosition.x, y: pointerPosition.y },
        };
        setCurrentShape(newShape);
      }
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !startPos || !currentShape) return;

    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();
    if (!pointerPosition) return;

    const shapeData = shapeMap[currentShape.type].createShape(
      startPos,
      pointerPosition
    );

    const updatedShape = {
      ...currentShape,
      ...shapeData,
    };

    setCurrentShape(updatedShape);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      addShape(currentShape);
      setIsDrawing(false);
      setCurrentShape(null);
      setStartPos(null);
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentShape,
  };
};
