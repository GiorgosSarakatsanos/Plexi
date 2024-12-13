import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { Shape } from "./Shape";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";

export interface Tool {
  toolName?: string; // Optional tool name for debugging or identification
  handleMouseDown: (
    e: KonvaEventObject<MouseEvent | TouchEvent>, // Generalize for touch support
    stageRef: React.RefObject<Konva.Stage>,
    setDrawingShape: React.Dispatch<React.SetStateAction<Shape | null>>
  ) => void;
  handleMouseMove: (
    e: KonvaEventObject<MouseEvent | TouchEvent>, // Generalize for touch support
    drawingShape: Shape | null,
    setDrawingShape: React.Dispatch<React.SetStateAction<Shape | null>>
  ) => void;
  handleMouseUp: typeof commonHandleMouseUp; // Reuse type from the common implementation
  setUploadedImage?: (image: HTMLImageElement | null) => void; // Optional: Handles uploaded images
}
