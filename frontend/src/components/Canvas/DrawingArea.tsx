// components/Tools/DrawingArea.tsx

import React from "react";
import { Rect } from "react-konva";

interface DrawingAreaProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DrawingArea: React.FC<DrawingAreaProps> = ({ x, y, width, height }) => {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="white" // Light blue transparent fill
      stroke="lightblue"
      strokeWidth={2}
    />
  );
};

export default DrawingArea;
