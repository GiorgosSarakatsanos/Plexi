import React, { useEffect } from "react";
import * as fabric from "fabric";
import { shapeDataMap } from "./ShapeDataMap";

interface ShapeProps {
  type: keyof typeof shapeDataMap; // The type of shape (e.g., rectangle, circle)
  canvasRef: React.RefObject<fabric.Canvas>;
}

const Shape: React.FC<ShapeProps> = ({ type, canvasRef }) => {
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && type in shapeDataMap) {
      const shapeData = shapeDataMap[type];

      let shape: fabric.Object | Promise<fabric.Object> | null = null;

      if (shapeData.type === "rect") {
        shape = new fabric.Rect({
          width: shapeData.width,
          height: shapeData.height,
          fill: shapeData.fill,
          stroke: shapeData.stroke,
          strokeDashArray: shapeData.strokeDashArray,
          strokeWidth: shapeData.strokeWidth,
        });
      } else if (shapeData.type === "circle") {
        shape = new fabric.Circle({
          radius: shapeData.radius,
          fill: shapeData.fill,
          stroke: shapeData.stroke,
          strokeWidth: shapeData.strokeWidth,
        });
      }

      // Add the shape to the canvas
      if (shape) {
        canvas.add(shape);
        canvas.setActiveObject(shape);
      }
    }
  }, [type, canvasRef]);

  return null;
};

export default Shape;
