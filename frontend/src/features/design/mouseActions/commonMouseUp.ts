import Konva from "konva";
import { Shape } from "../helpers/Shape";
import { SelectedShape } from "../helpers/ToolTypes";
import { generateId } from "../../utils/idGenerator";
import { handleShapeSelection } from "./handleShapeSelection";

export const commonHandleMouseUp = (
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>,
  drawingShape: Shape | null,
  setDrawingShape: React.Dispatch<React.SetStateAction<Shape | null>>,
  setSelectedTool: React.Dispatch<React.SetStateAction<SelectedShape>>,
  stageRef: React.RefObject<Konva.Stage>,
  addLayer: (shapeType: string, shapeId: string, groupId?: string) => string,
  transformerRef: React.RefObject<Konva.Transformer>,
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>,
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (!drawingShape) return;

  const shapeId = generateId(drawingShape.type);
  const groupId = drawingShape.groupId || undefined;
  const layerId = addLayer(drawingShape.type, shapeId, groupId);

  if (!layerId) {
    console.error("Layer ID could not be generated for the shape.");
    return;
  }

  const updatedShape = {
    ...drawingShape,
    id: shapeId,
    layerId,
    groupId,
  };

  setShapes((prev) => [...prev, updatedShape]);
  setDrawingShape(null);
  setSelectedTool("select");

  handleShapeSelection(
    stageRef,
    transformerRef,
    setSelectedShapeId,
    setSelectedLayerIds,
    layerId
  );
};
