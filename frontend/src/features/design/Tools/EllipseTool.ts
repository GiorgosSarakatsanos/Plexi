import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { generateId } from "../../utils/idGenerator";

export const EllipseTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: generateId("ellipse"),
      type: "ellipse",
      x: pointerPos.x,
      y: pointerPos.y,
      width: 0,
      height: 0,
      fill: "rgba(255, 0, 0, 0.2)",
      stroke: "red",
      strokeWidth: 2,
      layerId: "", // Layer ID will be assigned later
      draggable: true,
      listening: true,
    });
  },
  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape || drawingShape.type !== "ellipse") return;

    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        width: pointerPos.x - prev.x,
        height: pointerPos.y - prev.y,
      };
    });
  },
  handleMouseUp: commonHandleMouseUp,
};
