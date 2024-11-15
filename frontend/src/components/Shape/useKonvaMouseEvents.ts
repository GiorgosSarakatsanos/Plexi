import { useState } from "react";
import Konva from "konva";
import { Shape } from "./ShapeTypes";
import { generateId } from "../../utils/idGenerator";

const useKonvaMouseEvents = (
  selectedShape: string | null,
  addShape: (shape: Omit<Shape, "id">) => Shape,
  selectShapeById: (
    id: string | null,
    ctrlKey: boolean,
    shiftKey: boolean
  ) => void,
  stageRef: React.RefObject<Konva.Stage>,
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>> // Add this
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const handleMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const pointerPosition = stageRef.current?.getPointerPosition();
    const ctrlKey = event.evt.ctrlKey || event.evt.metaKey;
    const shiftKey = event.evt.shiftKey;

    if (selectedShape === "select") {
      const clickedOnShapeId = stageRef.current?.getIntersection(
        pointerPosition ?? { x: 0, y: 0 }
      )?.attrs?.id;

      if (clickedOnShapeId) {
        const shapeId = clickedOnShapeId.replace("shape-", "");
        selectShapeById(shapeId, ctrlKey, shiftKey); // Pass ctrlKey and shiftKey
      } else {
        selectShapeById(null, ctrlKey, shiftKey); // Deselect if clicked on empty space
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

      selectShapeById(finalizedShape.id, false, false); // Select the finalized shape

      setIsDrawing(false);
      setStartPos(null);
      setCurrentShape(null);

      console.log("Switching tool to select");
      setSelectedShape("select");
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
