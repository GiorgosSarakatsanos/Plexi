import Konva from "konva";
import { calculatePointerPosition } from "./calculatePointerPosition"; // Adjust path as needed

export const usePointerPosition = (stageRef: React.RefObject<Konva.Stage>) => {
  const getPointerPosition = () => calculatePointerPosition(stageRef.current);

  return getPointerPosition;
};
