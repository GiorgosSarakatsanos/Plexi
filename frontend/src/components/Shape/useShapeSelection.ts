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
      // Find the selected shape by id
      const selectedNode = shapes.find((shape) => shape.id === selectedShapeId);
      if (selectedNode) {
        const stage = transformer.getStage();
        if (stage) {
          // Use the actual shape id to find the node on the stage
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
