import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { createShapeBase } from "../helpers/ShapeBase";

export const EllipseTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: "ellipse",
      type: "ellipse",
      width: 0,
      height: 0,
      ...createShapeBase(pointerPos),
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
