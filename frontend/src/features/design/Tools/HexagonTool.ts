import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { createShapeBase } from "../helpers/ShapeBase";

export const HexagonTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape({
      id: "hexagon",
      type: "hexagon",
      radius: 0,
      sides: 6, // Default number of sides
      ...createShapeBase(pointerPos),
    });

    const adjustSides = (event: WheelEvent) => {
      event.preventDefault();
      setDrawingShape((prev) => {
        if (!prev || prev.type !== "hexagon") return prev;

        const currentSides = prev.sides || 6;
        const newSides = Math.max(
          3,
          currentSides + (event.deltaY < 0 ? 1 : -1)
        );
        return { ...prev, sides: newSides };
      });
    };

    stage?.container().addEventListener("wheel", adjustSides);

    stage?.on("mouseup touchend", () =>
      stage?.container().removeEventListener("wheel", adjustSides)
    );
  },
  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    if (!drawingShape || drawingShape.type !== "hexagon") return;

    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    setDrawingShape((prev) => {
      if (!prev) return null;
      const dx = pointerPos.x - prev.x;
      const dy = pointerPos.y - prev.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      return { ...prev, radius };
    });
  },
  handleMouseUp: commonHandleMouseUp,
};
