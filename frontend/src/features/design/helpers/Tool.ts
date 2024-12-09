import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { Shape } from "./Shape";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";

export interface Tool {
  handleMouseDown: (
    e: KonvaEventObject<MouseEvent>,
    stageRef: React.RefObject<Konva.Stage>,
    setDrawingShape: React.Dispatch<React.SetStateAction<Shape | null>>
  ) => void;
  handleMouseMove: (
    e: KonvaEventObject<MouseEvent>,
    drawingShape: Shape | null,
    setDrawingShape: React.Dispatch<React.SetStateAction<Shape | null>>
  ) => void;
  handleMouseUp: typeof commonHandleMouseUp;
  setUploadedImage?: (image: HTMLImageElement | null) => void; // Accepts HTMLImageElement
}
