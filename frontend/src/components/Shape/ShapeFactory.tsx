import React from "react";
import { Rect, Ellipse, Line } from "react-konva";
import { shapeMap } from "./ShapeMap";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";
import { Shape } from "./ShapeProps"; // Import the shared Shape interface

interface ShapeFactoryProps extends Shape {
  shapeType: string; // Add shapeType to the props
  isDraggable?: boolean; // Make shapes draggable
  isSelected?: boolean; // Add prop for selection (if needed for other logic)
}

const ShapeFactory: React.FC<ShapeFactoryProps> = ({
  shapeType, // Use shapeType here
  position,
  id,
  width,
  height,
  radiusX,
  radiusY,
  points,
  isDraggable = false,
}) => {
  const shapeProps = shapeMap[shapeType];

  if (!shapeProps) {
    return null;
  }

  const { type, defaultProps } = shapeProps;

  // Centralized shape rendering logic
  const shapeCommonProps = {
    id: `shape-${id}`, // Ensure proper id is set for selection
    x: position.x,
    y: position.y,
    draggable: isDraggable,
    ...defaultProps, // Spread default props if available
  };

  switch (type) {
    case "rect":
      return (
        <Rect
          {...shapeCommonProps}
          width={width || 100}
          height={height || 50}
        />
      );
    case "ellipse":
      return (
        <Ellipse
          {...(shapeCommonProps as EllipseConfig)}
          radiusX={radiusX || 50}
          radiusY={radiusY || 25}
        />
      );
    case "line":
      return (
        <Line {...(shapeCommonProps as LineConfig)} points={points || []} />
      );
    default:
      return null;
  }
};

export default ShapeFactory;
