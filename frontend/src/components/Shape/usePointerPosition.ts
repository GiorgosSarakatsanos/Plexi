import Konva from "konva";

export const usePointerPosition = (stageRef: React.RefObject<Konva.Stage>) => {
  const getPointerPosition = () => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return { x: 0, y: 0 };

    const scale = stage.scaleX(); // Assuming uniform scaling
    const position = stage.position();

    return {
      x: (pointerPosition.x - position.x) / scale,
      y: (pointerPosition.y - position.y) / scale,
    };
  };

  return getPointerPosition;
};
