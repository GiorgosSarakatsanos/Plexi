import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";

export const LineTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: ("line"),
      type: "line",
      x: pointerPos.x,
      y: pointerPos.y,
      points: [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y], // Initialize start and end points
      stroke: "orange",
      strokeWidth: 2,
      fill: "transparent",
      layerId: "",
      draggable: true,
      listening: true,
    });
  },

  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape || drawingShape.type !== "line") return;

    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape((prev) => {
      if (!prev) return null;

      const [startX, startY] = prev.points || [prev.x, prev.y]; // Safely default to initial coordinates
      return {
        ...prev,
        points: [startX, startY, pointerPos.x, pointerPos.y], // Update end point
      };
    });
  },

  handleMouseUp: commonHandleMouseUp,
};
