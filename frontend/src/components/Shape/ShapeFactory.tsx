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
  shapeType: string; // Specify the shape type
  position: Position;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  layer: number; // Include layer as a required prop
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
  layer, // Include the layer prop
  isDraggable = false, // Default is not draggable unless select tool is active
}) => {
  console.log("ShapeFactory received:", {
    shapeType,
    position,
    width,
    height,
    radiusX,
    radiusY,
    points,
  });

  const shapeProps = shapeMap[shapeType];

  if (!shapeProps) {
    return null;
  }

  const { type, defaultProps } = shapeProps;

  const shapeCommonProps = {
    id: `shape-${id}`, // Ensure proper id is set for selection
    draggable: isDraggable,
    ...defaultProps, // Spread default props if available
    layer, // Assign the layer to the shape's props
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
