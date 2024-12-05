import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { createShapeBase } from "../helpers/ShapeBase";

export const LineTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: "line",
      type: "line",
      points: [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y],
      ...createShapeBase(pointerPos),
    });
  },
  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape || drawingShape.type !== "line") return;

    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape((prev) => {
      if (!prev) return null;
      const [startX, startY] = prev.points || [prev.x, prev.y];
      return { ...prev, points: [startX, startY, pointerPos.x, pointerPos.y] };
    });
  },
  handleMouseUp: commonHandleMouseUp,
};
