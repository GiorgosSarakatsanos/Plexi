import React from "react";
import { Rect, Ellipse, Line } from "react-konva";
import { shapeMap } from "./ShapeMap";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";

interface ShapeFactoryProps {
  shapeType: string;
  position: { x: number; y: number };
  id: number; // Add id to props
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  isDraggable?: boolean; // Make shapes draggable
  isSelected?: boolean; // Add prop for selection
}

const ShapeFactory: React.FC<ShapeFactoryProps> = ({
  shapeType,
  position,
  id, // Use id passed via props
  width,
  height,
  radiusX,
  radiusY,
  points,
  isDraggable = false,
  isSelected = false, // Default not selected
}) => {
  const shapeProps = shapeMap[shapeType];

  if (!shapeProps) {
    return null;
  }

  const { type, defaultProps } = shapeProps;

  const boundingBox = isSelected ? (
    <Rect
      x={position.x - 5} // Adjust for padding
      y={position.y - 5}
      width={(width || 100) + 10}
      height={(height || 50) + 10}
      stroke="blue"
      strokeWidth={2}
      dash={[4, 4]} // Dashed line for bounding box
    />
  ) : null;

  switch (type) {
    case "rect":
      return (
        <>
          {boundingBox}
          <Rect
            id={`shape-${id}`} // Ensure proper id is set for selection
            x={position.x}
            y={position.y}
            width={width || 100}
            height={height || 50}
            draggable={isDraggable}
            {...(defaultProps || {})} // Pass default props if available
          />
        </>
      );
    case "ellipse":
      return (
        <>
          {boundingBox}
          <Ellipse
            id={`shape-${id}`} // Ensure proper id is set for selection
            {...(defaultProps as EllipseConfig)}
            x={position.x}
            y={position.y}
            radiusX={radiusX || 50}
            radiusY={radiusY || 25}
            draggable={isDraggable}
          />
        </>
      );
    case "line":
      return (
        <>
          {boundingBox}
          <Line
            id={`shape-${id}`} // Ensure proper id is set for selection
            {...(defaultProps as LineConfig)}
            points={points || []}
            draggable={isDraggable}
          />
        </>
      );
    default:
      return null;
  }
};

export default ShapeFactory;
