import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { createShapeBase } from "../helpers/ShapeBase";

export const TextTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: "text",
      type: "text",
      text: "Double-click to edit",
      fontSize: 16,
      fontFamily: "Arial",
      ...createShapeBase(pointerPos), // Use defaults from createShapeBase
      stroke: "transparent", // Override if needed
      fill: "black", // Override if needed
    });
  },
  handleMouseMove: () => {
    // No move logic required for text placement
  },
  handleMouseUp: commonHandleMouseUp,
};
