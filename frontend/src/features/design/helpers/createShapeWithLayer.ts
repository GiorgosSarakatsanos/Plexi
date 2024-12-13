import { Shape } from "../helpers/Shape";
import { generateId } from "../../utils/idGenerator";

export const createShapeWithLayer = (
  drawingShape: Shape,
  addLayer: (shapeType: string, shapeId: string, groupId?: string) => string
): Shape | null => {
  // Generate unique IDs for the shape and layer
  const shapeId = generateId(drawingShape.type);
  const groupId = drawingShape.groupId || undefined;
  const layerId = addLayer(drawingShape.type, shapeId, groupId);

  // If layer creation fails, return null
  if (!layerId) {
    console.error("Layer ID could not be generated for the shape.");
    return null;
  }

  // Construct and return the updated shape
  return {
    ...drawingShape,
    id: shapeId,
    layerId,
    groupId,
  };
};
