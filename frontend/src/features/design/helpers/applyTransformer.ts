import Konva from "konva";

export const applyTransformer = (
  stageRef: React.RefObject<Konva.Stage>,
  transformerRef: React.RefObject<Konva.Transformer>,
  layerId: string | null
) => {
  const stage = stageRef.current;
  const transformer = transformerRef.current;

  if (!stage || !transformer) return;

  if (!layerId) {
    transformer.nodes([]);
    transformer.getLayer()?.batchDraw();
    return;
  }

  const layer = stage.getLayers()[0]; // Adjust if multiple layers exist

  // Explicitly type 'node' as Konva.Node
  const shapeNode = layer.findOne(
    (node: Konva.Node) => node.attrs.layerId === layerId
  );
  if (!shapeNode) return;

  transformer.nodes([shapeNode]);
  transformer.getLayer()?.batchDraw();
};
