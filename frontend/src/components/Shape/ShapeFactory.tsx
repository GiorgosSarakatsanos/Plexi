// ShapeFactory.tsx
import React from "react";
import { Rect, Ellipse, Line } from "react-konva";
import { shapeMap } from "./ShapeMap";
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
  layer: number;
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
  layer,
  isDraggable = false,
}) => {

  const shapeProps = shapeMap[shapeType];

  if (!shapeProps) {
    return null;
  }

  const { type, defaultProps } = shapeProps;

  const shapeCommonProps = {
    id: `shape-${id}`, // Use the consistent ID passed here
    draggable: isDraggable,
    ...defaultProps,
    layer,
  };

  switch (type) {
    case "rect":
      return width && height ? (
        <Rect
          {...shapeCommonProps}
          x={position.x}
          y={position.y}
          width={width}
          height={height}
        />
      ) : null;

    case "ellipse":
      return radiusX && radiusY ? (
        <Ellipse
          {...(shapeCommonProps as EllipseConfig)}
          x={position.x}
          y={position.y}
          radiusX={radiusX}
          radiusY={radiusY}
        />
      ) : null;

    case "line":
      return points && points.length ? (
        <Line
          {...(shapeCommonProps as LineConfig)}
          points={points}
          draggable={isDraggable}
        />
      ) : null;

    case "triangle":
      return points && points.length ? (
        <Line
          {...(shapeCommonProps as LineConfig)}
          points={points}
          draggable={isDraggable}
          closed
        />
      ) : null;

    default:
      return null;
  }
};

export default ShapeFactory;
