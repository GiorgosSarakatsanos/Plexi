import React from "react";
import ShapeFactory from "./ShapeFactory";
import { Shape } from "./ShapeTypes";

interface ShapeRendererProps {
  shapes: Shape[];
  currentShape: Shape | null;
  selectedShapeId: number | null;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shapes,
  currentShape,
  selectedShapeId,
}) => {
  return (
    <>
      {shapes.map((shape) => {
        console.log("Rendering shape:", shape); // Debugging line
        return (
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
          />
        );
      })}
      {currentShape && (
        <ShapeFactory
          key="temp-shape"
          id={0} // Temporary ID
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
