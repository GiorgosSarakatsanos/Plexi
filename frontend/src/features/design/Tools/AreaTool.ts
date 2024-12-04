import Konva from "konva";
import { Tool } from "../helpers/Tool";
import { generateId } from "@/features/utils/idGenerator";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { Shape } from "../helpers/Shape"; // Assuming Shape is defined in this module

export const AreaTool: Tool & {
  addShapeToStage?: (
    stageRef: React.RefObject<Konva.Stage>,
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>, // Use Shape[] instead of any[]
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

    setDrawingShape({
      id: generateId("area"),
      type: "area",
      x: pointerPos.x,
      y: pointerPos.y,
      width: 0,
      height: 0,
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
      layerId: "",
      draggable: true,
      listening: true,
    });
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

    const newShape: Shape = {
      id: generateId("area"),
      type: "area",
      x,
      y,
      width,
      height,
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
      layerId: "",
      draggable: true,
      listening: true,
    };

    setShapes((prevShapes) => [...prevShapes, newShape]);
  },
};
