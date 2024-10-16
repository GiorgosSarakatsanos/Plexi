import * as fabric from "fabric";
import { shapeDataMap } from "./ShapeData";
import { useLineTool } from "./Line/LineTool";
import { usePolylineTool } from "./Polyline/PolylineTool";
import { useRectangleTool } from "./Rectangle/RectangleTool";
import { useTriangleTool } from "./Triangle/TriangleTool"; // Import the triangle tool
import { CircleData, TextData, ShapeData } from "./ShapeTypes";

export const useAddShape = (canvas: fabric.Canvas | undefined) => {
  const { startLine, extendLine, finishLine } = useLineTool(canvas);
  const { startPolyline, extendPolyline, finishPolyline } =
    usePolylineTool(canvas);
  const { startRectangle, extendRectangle, finishRectangle } =
    useRectangleTool(canvas);
  const { startTriangle, extendTriangle, finishTriangle } =
    useTriangleTool(canvas); // Use the triangle tool

  const addShape = (shapeType: keyof typeof shapeDataMap) => {
    if (!canvas) return;

    const shapeData: ShapeData | undefined = shapeDataMap[shapeType];

    if (!shapeData) {
      console.error(`Shape type '${shapeType}' does not exist.`);
      return;
    }

    if (shapeData.type === "rect") {
      canvas.on("mouse:down", startRectangle);
      canvas.on("mouse:move", extendRectangle);
      canvas.on("mouse:up", () => {
        finishRectangle();
        canvas.off("mouse:down", startRectangle);
        canvas.off("mouse:move", extendRectangle);
        canvas.off("mouse:up", finishRectangle);
      });
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
      canvas.on("mouse:down", startLine);
      canvas.on("mouse:move", extendLine);
      canvas.on("mouse:up", () => {
        finishLine();
        canvas.off("mouse:down", startLine);
        canvas.off("mouse:move", extendLine);
        canvas.off("mouse:up", finishLine);
      });
    } else if (shapeData.type === "i-text") {
      canvas.on("mouse:down", (event) => {
        const pointer = canvas.getPointer(event.e);
        const textData = shapeData as TextData;
        const iText = new fabric.IText(textData.text, {
          left: pointer.x,
          top: pointer.y,
          fontSize: textData.fontSize,
          fill: textData.fill,
        });
        canvas.add(iText);
        canvas.setActiveObject(iText);
      });
    } else if (shapeData.type === "triangle") {
      canvas.on("mouse:down", startTriangle);
      canvas.on("mouse:move", extendTriangle);
      canvas.on("mouse:up", () => {
        finishTriangle();
        canvas.off("mouse:down", startTriangle);
        canvas.off("mouse:move", extendTriangle);
        canvas.off("mouse:up", finishTriangle);
      });
    } else if (shapeType === "polyline") {
      canvas.on("mouse:down", startPolyline);
      canvas.on("mouse:move", extendPolyline);
      document.addEventListener("keydown", finishPolyline);

      canvas.on("mouse:up", () => {
        canvas.off("mouse:down", startPolyline);
        canvas.off("mouse:move", extendPolyline);
        document.removeEventListener("keydown", finishPolyline);
      });
    }
  };

  return { addShape };
};
