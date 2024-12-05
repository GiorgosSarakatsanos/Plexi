import Konva from "konva";
import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { createShapeBase } from "../helpers/ShapeBase";
import { Shape } from "../helpers/Shape";

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

    setDrawingShape({
      ...createShapeBase(pointerPos), // Use base properties
      id: "area",
      type: "area", // Ensure type is explicitly "area"
      width: 0,
      height: 0,
      fill: "white", // Override to white
      stroke: "lightgray", // Light gray for stroke
      strokeWidth: 1, // Specific stroke width
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
      ...createShapeBase({ x, y }), // Use base properties
      id: "area",
      type: "area", // Explicitly set the type as "area"
      width,
      height,
      fill: "white", // Override to white
      stroke: "lightgray",
      strokeWidth: 1,
    };
    setShapes((prevShapes) => [...prevShapes, newShape]); // Ensure correct type for new shapes
  },
};
