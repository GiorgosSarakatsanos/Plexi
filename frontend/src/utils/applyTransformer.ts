import Konva from "konva";

export const applyTransformer = (
  stageRef: React.RefObject<Konva.Stage>,
  transformerRef: React.RefObject<Konva.Transformer>,
  shapeId: string | null
) => {
  const stage = stageRef.current;
  const transformer = transformerRef.current;

  if (!stage || !transformer) return;

  // Remove transformer nodes if no shape is selected
  if (!shapeId) {
    transformer.nodes([]);
    transformer.getLayer()?.batchDraw();
    return;
  }

  const layer = stage.getLayers()[0]; // Adjust if you have multiple layers
  const shapeNode = layer.findOne(`#${shapeId}`);
  if (!shapeNode) return;

  // Attach transformer to the shape
  transformer.nodes([shapeNode]);
  transformer.getLayer()?.batchDraw();
};
