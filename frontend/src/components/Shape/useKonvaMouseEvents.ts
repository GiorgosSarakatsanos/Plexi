import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { shapeMap } from "./ShapeMap";
import { Shape } from "./ShapeTypes";

export const useKonvaMouseEvents = (
  selectedShape: string | null,
  addShape: (shape: Shape) => void,
  selectShapeById: (id: number | null) => void
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();

    if (selectedShape === "select") {
      // Handle selection
      const clickedOnShapeId = e.target?.attrs?.id;
      if (clickedOnShapeId) {
        selectShapeById(parseInt(clickedOnShapeId.replace("shape-", "")));
      } else {
        selectShapeById(null);
      }
    } else {
      // Start drawing shape
      if (selectedShape && pointerPosition) {
        setIsDrawing(true);
        setStartPos(pointerPosition);

        const newShape: Shape = {
          id: Date.now(), // Generate a unique ID based on timestamp
          type: selectedShape,
          position: { x: pointerPosition.x, y: pointerPosition.y },
          layer: 1, // Example layer (you can change this logic)
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

    const shapeProps = shapeMap[currentShape.type];
    if (!shapeProps) return;

    const shapeData = shapeProps.createShape(startPos, pointerPosition);
    const updatedShape = { ...currentShape, ...shapeData };

    setCurrentShape(updatedShape);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      addShape(currentShape); // Add the finalized shape
      setIsDrawing(false);

      // Automatically select the newly drawn shape
      selectShapeById(currentShape.id);

      setCurrentShape(null); // Clear currentShape to prevent it from rendering
      setStartPos(null); // Reset the start position
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentShape,
  };
};
