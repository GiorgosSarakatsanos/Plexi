import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { createShapeBase } from "../helpers/ShapeBase";

export const PenTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: "pen",
      type: "pen",
      points: [pointerPos.x, pointerPos.y],
      tension: 0.5,
      ...createShapeBase(pointerPos),
    });
  },
  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape || drawingShape.type !== "pen") return;

    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape((prev) => {
      if (!prev) return null;
      const newPoints = [...(prev.points || []), pointerPos.x, pointerPos.y];
      return { ...prev, points: newPoints };
    });
  },
  handleMouseUp: commonHandleMouseUp,
};
