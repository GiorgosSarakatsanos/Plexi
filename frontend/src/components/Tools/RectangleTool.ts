import { Tool } from "./Tool";
import { commonHandleMouseUp } from "../MouseActions/commonMouseUp";
import { generateId } from "../../utils/idGenerator";

export const RectangleTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: generateId("rect"),
      type: "rect",
      x: pointerPos.x,
      y: pointerPos.y,
      width: 0,
      height: 0,
      fill: "rgba(0, 0, 255, 0.2)",
      stroke: "blue",
      strokeWidth: 2,
      layerId: "",
    });
  },
  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape || drawingShape.type !== "rect") return;

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
