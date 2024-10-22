import { useRef, useEffect } from "react";
import Konva from "konva";

interface Shape {
  id: number;
  type: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
}

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
          // Find the shape node by id
          const shapeNode = stage.findOne(
            `#shape-${selectedNode.position.x}-${selectedNode.position.y}`
          );
          if (shapeNode) {
            transformer.nodes([shapeNode]); // Attach Transformer to shape
            transformer.getLayer()?.batchDraw();
          }
        }
      } else {
        transformer.nodes([]); // Deselect if no shape selected
      }
    }
  }, [shapes, selectedShapeId]);

  return transformerRef;
};
