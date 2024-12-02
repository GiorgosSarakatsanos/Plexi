import { Tool } from "../helpers/Tool";
import { generateId } from "../../utils/idGenerator";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";

export const HexagonTool: Tool = {
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    // Create a shape with initial sides and radius
    setDrawingShape({
      id: generateId("hexagon"),
      type: "hexagon",
      x: pointerPos.x,
      y: pointerPos.y,
      radius: 0,
      sides: 6, // Default sides
      fill: "rgba(0, 255, 0, 0.2)",
      stroke: "green",
      strokeWidth: 2,
      layerId: "",
      draggable: true,
      listening: true,
    });

    const adjustSides = (event: WheelEvent) => {
      event.preventDefault();
      setDrawingShape((prev) => {
        if (!prev || prev.type !== "hexagon") return prev;

        const currentSides = prev.sides || 6; // Ensure sides is defined with a default
        const newSides = Math.max(
          3,
          currentSides + (event.deltaY < 0 ? 1 : -1)
        );
        console.log("Updating sides:", newSides);
        return { ...prev, sides: newSides };
      });
    };

    // Add the event listener for the wheel event
    stage?.container().addEventListener("wheel", adjustSides);

    // Cleanup the wheel event listener when the mouse is released
    const removeWheelListener = () => {
      stage?.container().removeEventListener("wheel", adjustSides);
    };

    stage?.on("mouseup touchend", removeWheelListener);
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
      const radius = Math.sqrt(dx * dx + dy * dy); // Calculate radius
      console.log("Updating radius:", radius);
      return { ...prev, radius };
    });
  },
  handleMouseUp: commonHandleMouseUp,
};
