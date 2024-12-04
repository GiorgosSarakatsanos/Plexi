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
  addLayer: (shapeType: string, shapeId: string, groupId?: string) => string, // Ensure groupId matches
  transformerRef: React.RefObject<Konva.Transformer>,
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!drawingShape) return;

  // Generate ID for the shape
  const shapeId = generateId(drawingShape.type);

  // Use the LayerProvider's addLayer to create a layer and get its ID
  const groupId = drawingShape.groupId || undefined; // Use undefined if not provided
  const layerId = addLayer(drawingShape.type, shapeId, groupId);

  const updatedShape = {
    ...drawingShape,
    id: shapeId, // Assign the generated ID
    layerId, // Assign the layer ID from addLayer
    groupId, // Include the groupId (even if undefined)
  };

  console.log("Generated shape ID:", shapeId);
  console.log("Assigned layer ID:", layerId);
  console.log("Assigned group ID:", groupId ?? "None");

  // Add the shape to the shapes array
  setShapes((prev) => [...prev, updatedShape]);
  setDrawingShape(null); // Reset the drawing shape
  setSelectedTool("select"); // Switch back to the select tool

  // Set the selected shape ID
  setSelectedShapeId(shapeId);
  console.log("setSelectedShapeId called with:", shapeId);

  // Apply the transformer to the shape
  applyTransformer(stageRef, transformerRef, shapeId);
};
