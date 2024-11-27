import React from "react";
import { Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

interface LineShapeProps {
  id: string;
  points: number[]; // Array of x, y coordinates
  stroke: string;
  strokeWidth: number;
  onClick?: () => void;
  onDragMove?: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
  draggable?: boolean;
}

const LineShape: React.FC<LineShapeProps> = ({
  id,
  points,
  stroke,
  strokeWidth,
  onClick,
  onDragMove,
  onDragEnd,
  draggable = false,
}) => {
  return (
    <Line
      id={id}
      points={points}
      stroke={stroke}
      strokeWidth={strokeWidth}
      draggable={draggable}
      onClick={onClick}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    />
  );
};

export default LineShape;
