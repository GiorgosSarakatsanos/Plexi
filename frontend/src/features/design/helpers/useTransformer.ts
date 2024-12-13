import { useRef } from "react";
import Konva from "konva";

export const useTransformer = () => {
  const transformerRef = useRef<Konva.Transformer>(null);

  const applyTransformer = (
    stageRef: React.RefObject<Konva.Stage>,
    layerId: string | null
  ) => {
    const stage = stageRef.current;
    const transformer = transformerRef.current;

    if (!stage || !transformer) {
      console.warn("Stage or Transformer is not initialized");
      return;
    }

    if (!layerId) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }

    // Find the target node by layerId
    const shapeNode = stage.findOne(
      (node: Konva.Node) => node.attrs.layerId === layerId
    );

    if (!shapeNode) {
      console.warn(`No shape found with layerId: ${layerId}`, {
        layerId,
        stageChildren: stage.getChildren().map((child) => child.attrs),
      });
      return;
    }

    // Apply transformer to the found shape
    transformer.nodes([shapeNode]);
    transformer.getLayer()?.batchDraw();
  };

  const clearTransformer = () => {
    const transformer = transformerRef.current;
    if (transformer) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    }
  };

  return { transformerRef, applyTransformer, clearTransformer };
};
