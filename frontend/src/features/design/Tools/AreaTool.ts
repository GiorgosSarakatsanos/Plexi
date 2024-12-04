import Konva from "konva";
import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { Shape } from "../helpers/Shape";

// Utility function to create a shape
const createShape = (
  x: number,
  y: number,
  width: number,
  height: number
): Shape => ({
  id: "area",
  type: "area",
  x,
  y,
  width,
  height,
  fill: "white",
  stroke: "lightgray",
  strokeWidth: 1,
  layerId: "",
  draggable: true,
  listening: true,
});

export const AreaTool: Tool & {
  addShapeToStage?: (
    stageRef: React.RefObject<Konva.Stage>,
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
} = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape(createShape(pointerPos.x, pointerPos.y, 0, 0));
  },

  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape) return;

    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    const newWidth = pointerPos.x - drawingShape.x;
    const newHeight = pointerPos.y - drawingShape.y;

    setDrawingShape({
      ...drawingShape,
      width: newWidth,
      height: newHeight,
    });
  },

  handleMouseUp: commonHandleMouseUp,

  addShapeToStage: (stageRef, setShapes, x, y, width, height) => {
    const stage = stageRef.current;
    if (!stage) return;

    const newShape = createShape(x, y, width, height);
    setShapes((prevShapes) => [...prevShapes, newShape]);
  },
};
