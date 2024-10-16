import * as fabric from "fabric";
import {
  shapeDataMap,
  RectangleData,
  CircleData,
  LineData,
  TextData,
} from "./ShapeDataMap"; // Import the new types

export const useAddShape = (canvas: fabric.Canvas | undefined) => {
  const addShape = (shapeType: keyof typeof shapeDataMap) => {
    if (!canvas) return;

    const shapeData = shapeDataMap[shapeType];

    if (shapeData.type === "rect") {
      const rectData = shapeData as RectangleData;
      const rect = new fabric.Rect({
        width: rectData.width,
        height: rectData.height,
        fill: rectData.fill,
        stroke: rectData.stroke,
        strokeDashArray: rectData.strokeDashArray,
        strokeWidth: rectData.strokeWidth,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
    } else if (shapeData.type === "circle") {
      const circleData = shapeData as CircleData;
      const circle = new fabric.Circle({
        radius: circleData.radius,
        fill: circleData.fill,
        stroke: circleData.stroke,
        strokeWidth: circleData.strokeWidth,
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
    } else if (shapeData.type === "line") {
      const lineData = shapeData as LineData;
      const line = new fabric.Line(
        [lineData.x1, lineData.y1, lineData.x2, lineData.y2],
        {
          stroke: lineData.stroke,
          strokeWidth: lineData.strokeWidth,
        }
      );
      canvas.add(line);
      canvas.setActiveObject(line);
    } else if (shapeData.type === "i-text") {
      const textData = shapeData as TextData;
      const iText = new fabric.IText(textData.text, {
        fontSize: textData.fontSize,
        fill: textData.fill,
      });
      canvas.add(iText);
      canvas.setActiveObject(iText);
    }
  };

  return { addShape };
};
