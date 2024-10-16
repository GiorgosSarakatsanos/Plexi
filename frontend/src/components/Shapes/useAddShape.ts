import * as fabric from "fabric";
import { shapeDataMap } from "./ShapeData";
import { useLineTool } from "./Line/LineTool";
import { usePolylineTool } from "./Polyline/PolylineTool";
import { useRectangleTool } from "./Rectangle/RectangleTool";
import { useTriangleTool } from "./Triangle/TriangleTool";
import { useEllipseTool } from "./Ellipse/EllipseTool";
import { useTextTool } from "./Text/TextTool";
import { TextData, ShapeData } from "./ShapeTypes";

export const useAddShape = (canvas: fabric.Canvas | undefined) => {
  const { startLine, extendLine, finishLine } = useLineTool(canvas);
  const { startPolyline, extendPolyline, finishPolyline } =
    usePolylineTool(canvas);
  const { startRectangle, extendRectangle, finishRectangle } =
    useRectangleTool(canvas);
  const { startTriangle, extendTriangle, finishTriangle } =
    useTriangleTool(canvas);
  const { startEllipse, extendEllipse, finishEllipse } = useEllipseTool(canvas);
  const { addText } = useTextTool(canvas);

  const disableObjectSelection = () => {
    if (!canvas) return;
    canvas.selection = false; // Disable selection box
    canvas.forEachObject((obj) => {
      obj.selectable = false; // Disable object selection
      obj.evented = false; // Disable events for objects
    });
  };

  const enableObjectSelection = () => {
    if (!canvas) return;
    canvas.selection = true; // Enable selection box
    canvas.forEachObject((obj) => {
      obj.selectable = true; // Enable object selection
      obj.evented = true; // Enable events for objects
    });
  };

  const addShape = (shapeType: keyof typeof shapeDataMap) => {
    if (!canvas) return;

    const shapeData: ShapeData | undefined = shapeDataMap[shapeType];

    if (!shapeData) {
      console.error(`Shape type '${shapeType}' does not exist.`);
      return;
    }

    disableObjectSelection(); // Disable selection before starting the draw

    // Rectangle Tool
    if (shapeData.type === "rect") {
      canvas.on("mouse:down", startRectangle);
      canvas.on("mouse:move", extendRectangle);
      canvas.on("mouse:up", () => {
        finishRectangle();
        canvas.off("mouse:down", startRectangle);
        canvas.off("mouse:move", extendRectangle);
        canvas.off("mouse:up", finishRectangle);
        enableObjectSelection(); // Re-enable selection after drawing is done
      });

      // Ellipse Tool
    } else if (shapeData.type === "circle") {
      canvas.on("mouse:down", startEllipse);
      canvas.on("mouse:move", extendEllipse);
      canvas.on("mouse:up", () => {
        finishEllipse();
        canvas.off("mouse:down", startEllipse);
        canvas.off("mouse:move", extendEllipse);
        canvas.off("mouse:up", finishEllipse);
        enableObjectSelection(); // Re-enable selection after drawing is done
      });

      // Line Tool
    } else if (shapeData.type === "line") {
      canvas.on("mouse:down", startLine);
      canvas.on("mouse:move", extendLine);
      canvas.on("mouse:up", () => {
        finishLine();
        canvas.off("mouse:down", startLine);
        canvas.off("mouse:move", extendLine);
        canvas.off("mouse:up", finishLine);
        enableObjectSelection(); // Re-enable selection after drawing is done
      });

      // Text Tool
    } else if (shapeData.type === "i-text") {
      canvas.on("mouse:down", (event) => {
        const textData = shapeData as TextData;
        addText(event, textData.text, textData.fontSize, textData.fill);
        canvas.off("mouse:down");
        enableObjectSelection(); // Re-enable selection after text is added
      });

      // Triangle Tool
    } else if (shapeData.type === "triangle") {
      canvas.on("mouse:down", startTriangle);
      canvas.on("mouse:move", extendTriangle);
      canvas.on("mouse:up", () => {
        finishTriangle();
        canvas.off("mouse:down", startTriangle);
        canvas.off("mouse:move", extendTriangle);
        canvas.off("mouse:up", finishTriangle);
        enableObjectSelection(); // Re-enable selection after drawing is done
      });

      // Polyline Tool
    } else if (shapeType === "polyline") {
      canvas.on("mouse:down", startPolyline);
      canvas.on("mouse:move", extendPolyline);
      document.addEventListener("keydown", finishPolyline);

      canvas.on("mouse:up", () => {
        // Keep drawing continuous lines, so no cleanup on mouse up
      });

      // Clean up when finishing polyline
      document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          finishPolyline(event);
          canvas.off("mouse:down", startPolyline);
          canvas.off("mouse:move", extendPolyline);
          document.removeEventListener("keydown", finishPolyline);
          enableObjectSelection(); // Re-enable selection after polyline is finished
        }
      });
    }
  };

  return { addShape };
};
