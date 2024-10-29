// ShapeFactory.tsx
import React from "react";
import { Rect, Ellipse, Line } from "react-konva";
import { shapeMap } from "./ShapeMap";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";
import Konva from "konva";

interface Position {
  x: number;
  y: number;
}

interface ShapeFactoryProps {
  id: string;
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
  onClick?: () => void;
  onDragMove?: (id: string, newPos: Position) => void;
  onDragEnd?: (id: string, finalPos: Position) => void;
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
  onClick,
  onDragMove,
  onDragEnd,
}) => {
  const shapeProps = shapeMap[shapeType];

  if (!shapeProps) {
    return null;
  }

  const { type, defaultProps } = shapeProps;

  const shapeCommonProps = {
    id: `shape-${id}`,
    draggable: isDraggable,
    onClick,
    strokeScaleEnabled: false,
    ...defaultProps,
    layer,
    onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => {
      if (onDragMove) {
        const { x, y } = e.target.position();
        onDragMove(id, { x, y });
      }
    },
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      if (onDragEnd) {
        const { x, y } = e.target.position();
        onDragEnd(id, { x, y });
      }
    },
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
