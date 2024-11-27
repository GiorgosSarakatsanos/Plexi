import React from "react";
import { Rect } from "react-konva";

interface RectShapeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  onClick?: () => void;
}

const RectShape: React.FC<RectShapeProps> = ({
  id,
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  onClick,
}) => {
  return (
    <Rect
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      draggable
      onClick={onClick}
    />
  );
};

export default RectShape;
