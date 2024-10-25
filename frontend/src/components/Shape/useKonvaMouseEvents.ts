import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape } from "./ShapeTypes";
import { generateId } from "../../utils/idGenerator";

export const useKonvaMouseEvents = (
  selectedShape: string | null,
  addShape: (shape: Omit<Shape, "id">) => Shape,
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
      const clickedOnShapeId = e.target?.attrs?.id;
      if (clickedOnShapeId) {
        selectShapeById(parseInt(clickedOnShapeId.replace("shape-", ""), 10));
      } else {
        selectShapeById(null);
      }
    } else if (selectedShape && pointerPosition) {
      setIsDrawing(true);
      setStartPos(pointerPosition);

      const newShape: Shape = {
        id: generateId(),
        type: selectedShape,
        position: { x: pointerPosition.x, y: pointerPosition.y },
        layer: 1,
      };
      setCurrentShape(newShape);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !startPos || !currentShape) return;

    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();
    if (!pointerPosition) return;

    const updatedShape = { ...currentShape };

    // Adjust properties based on selected shape type
    switch (currentShape.type) {
      case "rect":
        updatedShape.width = pointerPosition.x - startPos.x;
        updatedShape.height = pointerPosition.y - startPos.y;
        break;
      case "ellipse":
        updatedShape.radiusX = Math.abs(pointerPosition.x - startPos.x) / 2;
        updatedShape.radiusY = Math.abs(pointerPosition.y - startPos.y) / 2;
        updatedShape.position = {
          x: (pointerPosition.x + startPos.x) / 2,
          y: (pointerPosition.y + startPos.y) / 2,
        };
        break;
      case "line":
      case "triangle":
        updatedShape.points = [
          startPos.x,
          startPos.y,
          pointerPosition.x,
          pointerPosition.y,
        ];
        break;
      default:
        break;
    }

    setCurrentShape(updatedShape);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      const finalizedShape = addShape({
        type: currentShape.type,
        position: currentShape.position,
        width: currentShape.width,
        height: currentShape.height,
        radiusX: currentShape.radiusX,
        radiusY: currentShape.radiusY,
        points: currentShape.points,
        layer: currentShape.layer,
      });

      selectShapeById(finalizedShape.id);
      setIsDrawing(false);
      setStartPos(null);
      setCurrentShape(null);
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentShape,
  };
};
