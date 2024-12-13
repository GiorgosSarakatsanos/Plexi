import Konva from "konva";
import { Shape } from "../helpers/Shape";
import { SelectedShape } from "../helpers/ToolTypes";
import { createShapeWithLayer } from "../helpers/createShapeWithLayer";
import { handleShapeSelection } from "./handleShapeSelection";

export const commonHandleMouseUp = (
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>,
  drawingShape: Shape | null,
  setDrawingShape: React.Dispatch<React.SetStateAction<Shape | null>>,
  setSelectedTool: React.Dispatch<React.SetStateAction<SelectedShape>>,
  stageRef: React.RefObject<Konva.Stage>,
  addLayer: (shapeType: string, shapeId: string, groupId?: string) => string, // Updated to ensure it returns a string
  transformerRef: React.RefObject<Konva.Transformer>,
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>,
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (!drawingShape) return;

  // Use the helper to create the shape with its associated layer
  const updatedShape = createShapeWithLayer(drawingShape, addLayer);

  // If the shape creation failed, exit early
  if (!updatedShape) return;

  // Update state with the new shape and reset tool/drawing state
  setShapes((prev) => [...prev, updatedShape]);
  setDrawingShape(null);
  setSelectedTool("select");

  // Select the new shape
  handleShapeSelection(
    stageRef,
    transformerRef,
    setSelectedShapeId,
    setSelectedLayerIds,
    updatedShape.layerId
  );
};
