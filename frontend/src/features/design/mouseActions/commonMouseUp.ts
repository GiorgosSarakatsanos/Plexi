import Konva from "konva";
import { Shape } from "../helpers/Shape";
import { SelectedShape } from "../helpers/ToolTypes";
import { generateId } from "../../utils/idGenerator";
import { applyTransformer } from "../helpers/applyTransformer";

export const commonHandleMouseUp = (
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>,
  drawingShape: Shape | null,
  setDrawingShape: React.Dispatch<React.SetStateAction<Shape | null>>,
  setSelectedTool: React.Dispatch<React.SetStateAction<SelectedShape>>,
  stageRef: React.RefObject<Konva.Stage>,
  addLayer: ((shapeType: string, id: string) => void) | undefined,
  transformerRef: React.RefObject<Konva.Transformer>,
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!drawingShape) return;

  const layerId = generateId("layer");
  const updatedShape = { ...drawingShape, layerId };

  // Add shape to the shapes array
  setShapes((prev) => [...prev, updatedShape]);
  setDrawingShape(null); // Reset drawing shape
  setSelectedTool("select"); // Switch back to select tool

  // Add layer and select shape
  if (addLayer) {
    addLayer(drawingShape.type, updatedShape.id);
  }
  setSelectedShapeId(updatedShape.id);

  // Apply transformer
  applyTransformer(stageRef, transformerRef, updatedShape.id);
};
