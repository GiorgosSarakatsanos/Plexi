import React from "react";
import { Rect, Ellipse, Line } from "react-konva";
import { shapeMap } from "./ShapeMap";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";
import { Shape } from "./ShapeProps"; // Import the shared Shape interface

interface ShapeFactoryProps extends Shape {
  shapeType: string; // Add shapeType to the props
  isDraggable?: boolean; // Make shapes draggable
  isSelected?: boolean;
}

const ShapeFactory: React.FC<ShapeFactoryProps> = ({
  shapeType,
  position,
  id,
  width,
  height,
  radiusX,
  radiusY,
  points,
  isDraggable = false, // Default is not draggable unless select tool is active
}) => {
  const shapeProps = shapeMap[shapeType];

  if (!shapeProps) {
    return null;
  }

  const { type, defaultProps } = shapeProps;

  const shapeCommonProps = {
    id: `shape-${id}`, // Ensure proper id is set for selection
    draggable: isDraggable,
    ...defaultProps, // Spread default props if available
  };

  // Exclude position and other props for line and triangle shapes
  switch (type) {
    case "rect":
      return (
        <Rect
          {...shapeCommonProps}
          x={position.x}
          y={position.y}
          width={width || 100}
          height={height || 50}
        />
      );
    case "ellipse":
      return (
        <Ellipse
          {...(shapeCommonProps as EllipseConfig)}
          x={position.x}
          y={position.y}
          radiusX={radiusX || 50}
          radiusY={radiusY || 25}
        />
      );
    case "line":
      return (
        <Line
          {...(shapeCommonProps as LineConfig)} // Keep id but exclude position-related props
          points={points || []}
          draggable={isDraggable} // Add draggable prop
        />
      );
    case "triangle":
      return (
        <Line
          {...(shapeCommonProps as LineConfig)} // Keep id but exclude position-related props
          points={points || []}
          draggable={isDraggable} // Add draggable prop
          closed
        />
      );
    default:
      return null;
  }
};

export default ShapeFactory;
