// ShapeRenderer.tsx
import React, { useEffect, useRef } from "react";
import ShapeFactory from "./ShapeFactory";
import { Shape } from "./ShapeTypes";
import { useLayerContext } from "../Layer/useLayerContext";
import { generateId } from "../../utils/idGenerator";

interface ShapeRendererProps {
  shapes: Shape[];
  currentShape: Shape | null;
  selectedShapeId?: string | null; // Make selectedShapeId optional
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shapes,
  currentShape,
  selectedShapeId, // Receive selectedShapeId as a prop
}) => {
  const { addLayer, selectLayer } = useLayerContext(); // Access other context functions as needed
  const addedShapeIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    shapes.forEach((shape) => {
      const shapeIdStr = shape.id.toString();

      if (!addedShapeIds.current.has(shapeIdStr)) {
        const unifiedId = generateId();
        shape.id = unifiedId;
        addLayer(`${shape.type} ${unifiedId}`, unifiedId);

        addedShapeIds.current.add(unifiedId);
        console.log(`Shape created with ID: ${unifiedId}`);
      }
    });
  }, [shapes, addLayer]);

  const handleShapeSelect = (shapeId: string) => {
    selectLayer(shapeId);
    console.log(`Shape selected with ID: ${shapeId}`);
  };

  return (
    <>
      {shapes.map((shape) => (
        <ShapeFactory
          key={shape.id}
          id={shape.id}
          shapeType={shape.type}
          isSelected={shape.id === selectedShapeId} // Use selectedShapeId here
          position={shape.position}
          width={shape.width}
          height={shape.height}
          radiusX={shape.radiusX}
          radiusY={shape.radiusY}
          points={shape.points}
          layer={shape.layer}
          onClick={() => handleShapeSelect(shape.id)}
        />
      ))}
      {currentShape && (
        <ShapeFactory
          key="temp-shape"
          id="temp-shape"
          shapeType={currentShape.type}
          position={currentShape.position}
          width={currentShape.width}
          height={currentShape.height}
          radiusX={currentShape.radiusX}
          radiusY={currentShape.radiusY}
          points={currentShape.points}
          layer={currentShape.layer}
        />
      )}
    </>
  );
};

export default ShapeRenderer;
