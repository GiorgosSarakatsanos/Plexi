import { useState } from "react";
import Konva from "konva";
import { Shape } from "./ShapeTypes";
import { generateId } from "../../utils/idGenerator";

const useKonvaMouseEvents = (
  selectedShape: string | null,
  addShape: (shape: Omit<Shape, "id">) => Shape,
  selectShapeById: (id: string | null) => void,
  stageRef: React.RefObject<Konva.Stage>
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const handleMouseDown = () => {
    const pointerPosition = stageRef.current?.getPointerPosition();

    if (selectedShape === "select") {
      const clickedOnShapeId = stageRef.current?.getIntersection(
        pointerPosition ?? { x: 0, y: 0 }
      )?.attrs?.id;

      if (clickedOnShapeId) {
        // Remove "shape-" prefix if used in IDs
        const shapeId = clickedOnShapeId.replace("shape-", "");
        selectShapeById(shapeId);
      } else {
        selectShapeById(null);
      }
    } else if (selectedShape && pointerPosition) {
      setIsDrawing(true);
      setStartPos(pointerPosition);

      const newShape: Shape = {
        id: generateId(), // Ensure this ID matches the ID format used elsewhere
        type: selectedShape,
        position: { x: pointerPosition.x, y: pointerPosition.y },
        layer: 1,
        points: [],
      };
      setCurrentShape(newShape);
    }
  };

  const handleMouseMove = () => {
    if (!isDrawing || !startPos || !currentShape) return;

    const pointerPosition = stageRef.current?.getPointerPosition();
    if (!pointerPosition) return;

    const updatedShape = { ...currentShape };

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
        if (currentShape.type === "triangle") {
          updatedShape.points.push(
            startPos.x * 2 - pointerPosition.x,
            pointerPosition.y
          );
        }
        break;
      default:
        break;
    }

    setCurrentShape(updatedShape);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      // Finalize and add the shape
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

      // Set the newly created shape as selected with string ID
      selectShapeById(finalizedShape.id);

      // Reset drawing state
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

export default useKonvaMouseEvents;
