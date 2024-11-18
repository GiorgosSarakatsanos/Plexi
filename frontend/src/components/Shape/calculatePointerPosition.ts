import Konva from "konva";

export const calculatePointerPosition = (stage: Konva.Stage | null) => {
  if (!stage) {
    return { x: 0, y: 0 }; // Return default position if stage is null
  }

  const pointerPosition = stage.getPointerPosition();
  if (!pointerPosition) {
    return { x: 0, y: 0 }; // Default if no pointer position
  }

  const scale = stage.scaleX(); // Assuming uniform scaling (scaleX === scaleY)
  const position = stage.position();

  return {
    x: (pointerPosition.x - position.x) / scale,
    y: (pointerPosition.y - position.y) / scale,
  };
};
