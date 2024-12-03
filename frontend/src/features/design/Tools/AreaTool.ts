import { Tool } from "../helpers/Tool";
import { generateId } from "@/features/utils/idGenerator";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";

export const AreaTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: generateId("area"),
      type: "area",
      x: pointerPos.x,
      y: pointerPos.y,
      width: 0,
      height: 0,
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
      layerId: "",
      draggable: true,
      listening: true,
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
};
