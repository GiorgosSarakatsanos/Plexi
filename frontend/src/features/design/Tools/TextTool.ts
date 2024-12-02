import { Tool } from "../helpers/Tool";
import { generateId } from "../../utils/idGenerator";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";

export const TextTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: generateId("text"),
      type: "text",
      x: pointerPos.x,
      y: pointerPos.y,
      text: "Double-click to edit",
      fill: "black",
      stroke: "transparent",
      strokeWidth: 0,
      fontSize: 16,
      fontFamily: "Arial",
      layerId: "",
      draggable: true,
      listening: true,
    });
  },

  handleMouseMove: () => {
    // No move logic required for text placement
  },

  handleMouseUp: commonHandleMouseUp,
};
