import React from "react";
import { Rect, Ellipse, Line } from "react-konva";
import { shapeMap } from "./ShapeMap";
import { RectConfig } from "konva/lib/shapes/Rect";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";

interface ShapeFactoryProps {
  shapeType: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  isDraggable?: boolean; // New prop to make shapes draggable
}

const ShapeFactory: React.FC<ShapeFactoryProps> = ({
  shapeType,
  position,
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

  switch (type) {
    case "rect":
      return (
        <Rect
          {...(defaultProps as RectConfig)}
          x={position.x}
          y={position.y}
          width={width || 100}
          height={height || 50}
          draggable={isDraggable} // Add draggable prop
        />
      );
    case "ellipse":
      return (
        <Ellipse
          {...(defaultProps as EllipseConfig)}
          x={position.x}
          y={position.y}
          radiusX={radiusX || 50}
          radiusY={radiusY || 25}
          draggable={isDraggable} // Add draggable prop
        />
      );
    case "line":
      return (
        <Line
          {...(defaultProps as LineConfig)}
          points={points || []}
          draggable={isDraggable} // Add draggable prop
        />
      );
    case "triangle":
      return (
        <Line
          {...(defaultProps as LineConfig)}
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
