// useAddShape.ts
import * as fabric from "fabric";
import { shapeDataMap } from "./ShapeData";
import { useLineTool } from "./LineTool";
import {
  RectangleData,
  CircleData,
  TextData,
  TriangleData,
  PolylineData,
  ShapeData,
} from "./ShapeTypes";

export const useAddShape = (canvas: fabric.Canvas | undefined) => {
  const { startLine, extendLine, finishLine } = useLineTool(canvas);

  const addShape = (shapeType: keyof typeof shapeDataMap) => {
    if (!canvas) return;

    const shapeData: ShapeData | undefined = shapeDataMap[shapeType];

    if (!shapeData) {
      console.error(`Shape type '${shapeType}' does not exist.`);
      return;
    }

    // Type guard for Rectangle
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

      // Type guard for Circle
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

      // Type guard for Line
    } else if (shapeData.type === "line") {
      canvas.on("mouse:down", startLine);
      canvas.on("mouse:move", extendLine);
      canvas.on("mouse:up", () => {
        finishLine();
        canvas.off("mouse:down", startLine);
        canvas.off("mouse:move", extendLine);
        canvas.off("mouse:up", finishLine);
      });

      // Type guard for Text
    } else if (shapeData.type === "i-text") {
      const textData = shapeData as TextData;
      const iText = new fabric.IText(textData.text, {
        fontSize: textData.fontSize,
        fill: textData.fill,
      });
      canvas.add(iText);
      canvas.setActiveObject(iText);

      // Type guard for Triangle
    } else if (shapeData.type === "triangle") {
      const triangleData = shapeData as TriangleData;
      const triangle = new fabric.Triangle({
        width: triangleData.width,
        height: triangleData.height,
        fill: triangleData.fill,
        stroke: triangleData.stroke,
        strokeWidth: triangleData.strokeWidth,
      });
      canvas.add(triangle);
      canvas.setActiveObject(triangle);

      // Type guard for Polyline
    } else if (shapeData.type === "polyline") {
      const polylineData = shapeData as PolylineData;
      const polyline = new fabric.Polyline(polylineData.points, {
        stroke: polylineData.stroke,
        strokeWidth: polylineData.strokeWidth,
        fill: polylineData.fill,
      });
      canvas.add(polyline);
      canvas.setActiveObject(polyline);
    }
  };

  return { addShape };
};
