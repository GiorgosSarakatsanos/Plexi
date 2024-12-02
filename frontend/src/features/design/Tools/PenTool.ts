import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { generateId } from "../../utils/idGenerator";

export const PenTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: generateId("pen"),
      type: "pen",
      x: pointerPos.x,
      y: pointerPos.y,
      points: [pointerPos.x, pointerPos.y], // Initialize with the first point
      stroke: "green",
      strokeWidth: 5,
      tension: 0.5,
      fill: "transparent",
      layerId: "",
      draggable: true,
      listening: true,
    });
  },

  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape || drawingShape.type !== "pen") return;

    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape((prev) => {
      if (!prev) return null;

      const currentPoints = prev.points || []; // Ensure points is always an array
      const newPoints = [...currentPoints, pointerPos.x, pointerPos.y];
      return { ...prev, points: newPoints }; // Update the points
    });
  },

  handleMouseUp: commonHandleMouseUp,
};
