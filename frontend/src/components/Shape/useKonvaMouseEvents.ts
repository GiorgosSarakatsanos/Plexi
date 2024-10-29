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
        const shapeId = clickedOnShapeId.replace("shape-", "");
        if (shapeId === selectedShape) {
          // Deselect if already selected
          selectShapeById(null);
        } else {
          selectShapeById(shapeId); // Select shape
        }
      } else {
        // Deselect if clicked on an empty area
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

export default useKonvaMouseEvents;
