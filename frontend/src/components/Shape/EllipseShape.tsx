import React from "react";
import { Ellipse } from "react-konva";

interface EllipseShapeProps {
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

const EllipseShape: React.FC<EllipseShapeProps> = ({
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
    <Ellipse
      id={id}
      x={x}
      y={y}
      radiusX={width / 2} // Convert width to radiusX
      radiusY={height / 2} // Convert height to radiusY
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      draggable
      onClick={onClick}
    />
  );
};

export default EllipseShape;
