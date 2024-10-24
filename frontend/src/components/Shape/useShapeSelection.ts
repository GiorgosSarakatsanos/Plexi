import { useRef, useEffect } from "react";
import Konva from "konva";
import { Shape } from "./ShapeTypes"; // Import from the shared file

export const useShapeSelection = (
  shapes: Shape[],
  selectedShapeId: number | null
) => {
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (transformer) {
      const selectedNode = shapes.find((shape) => shape.id === selectedShapeId);
      if (selectedNode) {
        const stage = transformer.getStage();
        if (stage) {
          const shapeNode = stage.findOne(`#shape-${selectedNode.id}`);
          if (shapeNode) {
            transformer.nodes([shapeNode]); // Attach Transformer to the shape
            transformer.getLayer()?.batchDraw(); // Redraw layer
          }
        }
      } else {
        transformer.nodes([]); // Deselect if no shape is selected
      }
    }
  }, [shapes, selectedShapeId]);

  return transformerRef;
};
