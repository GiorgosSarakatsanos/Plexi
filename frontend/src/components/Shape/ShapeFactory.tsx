import React from "react";
import { Rect, Ellipse, Line } from "react-konva";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";

interface Position {
  x: number;
  y: number;
}

interface ShapeFactoryProps {
  id: number;
  shapeType: string;
  position: Position;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  layer: number; // Add this line if `layer` is required in ShapeFactory
  isDraggable?: boolean;
  isSelected?: boolean;
}

const ShapeFactory: React.FC<ShapeFactoryProps> = ({
  id,
  shapeType,
  position,
  width,
  height,
  radiusX,
  radiusY,
  points,
  isDraggable = false,
}) => {
  const shapeCommonProps = {
    id: `shape-${id}`,
    draggable: isDraggable,
    x: position.x,
    y: position.y,
    stroke: "blue", // Set common stroke color
    strokeWidth: 2,
  };

  // Render different shapes based on their type
  switch (shapeType) {
    case "rect":
      return width && height ? (
        <Rect
          {...shapeCommonProps}
          width={width}
          height={height}
          fill="transparent"
        />
      ) : null;

    case "ellipse":
      return radiusX && radiusY ? (
        <Ellipse
          {...(shapeCommonProps as EllipseConfig)}
          radiusX={radiusX}
          radiusY={radiusY}
          fill="transparent"
        />
      ) : null;

    case "line":
      return points && points.length >= 4 ? (
        <Line {...(shapeCommonProps as LineConfig)} points={points} />
      ) : null;

    case "triangle":
      return points && points.length >= 6 ? (
        <Line {...(shapeCommonProps as LineConfig)} points={points} closed />
      ) : null;

    default:
      return null;
  }
};

export default ShapeFactory;
