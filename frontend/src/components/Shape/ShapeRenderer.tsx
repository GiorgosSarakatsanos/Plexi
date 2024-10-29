import React, { useEffect, useRef } from "react";
import ShapeFactory from "./ShapeFactory";
import { Shape } from "./ShapeTypes";
import { useLayerContext } from "../Layer/useLayerContext";
import { generateId } from "../../utils/idGenerator";

interface ShapeRendererProps {
  shapes: Shape[];
  currentShape: Shape | null;
  selectedShapeId?: string | null;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shapes,
  currentShape,
  selectedShapeId,
}) => {
  const { addLayer, selectLayer } = useLayerContext();
  const addedShapeIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    shapes.forEach((shape) => {
      if (!addedShapeIds.current.has(shape.id)) {
        const unifiedId = shape.id || generateId();
        shape.id = unifiedId;
        addLayer(shape.type, unifiedId); // Pass shape type to addLayer

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
          isSelected={shape.id === selectedShapeId}
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
