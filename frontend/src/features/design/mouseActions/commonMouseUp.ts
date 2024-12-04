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
  addLayer: (shapeType: string, id: string) => void,
  transformerRef: React.RefObject<Konva.Transformer>,
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!drawingShape) return;

  // Generate ID for the shape
  const shapeId = generateId(drawingShape.type);

  const updatedShape = {
    ...drawingShape,
    id: shapeId, // Assign the generated ID
  };

  console.log("Generated shape ID:", shapeId);

  // Add the shape to the shapes array
  setShapes((prev) => [...prev, updatedShape]);
  setDrawingShape(null); // Reset the drawing shape
  setSelectedTool("select"); // Switch back to the select tool

  // Use the LayerProvider's addLayer to handle the layer
  addLayer(drawingShape.type, shapeId);

  // Set the selected shape ID
  setSelectedShapeId(shapeId);
  console.log("setSelectedShapeId called with:", shapeId);

  // Apply the transformer to the shape
  applyTransformer(stageRef, transformerRef, shapeId);
};
