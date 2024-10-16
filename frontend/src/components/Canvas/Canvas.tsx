import React, { useRef, useEffect } from "react";
import * as fabric from "fabric";
import { useAddShape } from "../Shapes/useAddShape";
import { shapeDataMap } from "../Shapes/ShapeDataMap"; // Import shapeDataMap

interface CanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
  selectedShape: keyof typeof shapeDataMap | null; // Selected shape type
  setSelectedShape: React.Dispatch<
    React.SetStateAction<keyof typeof shapeDataMap | null>
  >;
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor,
  selectedShape,
  setSelectedShape,
}) => {
  const canvasRef = useRef<fabric.Canvas | null>(null); // fabric.Canvas can be null initially
  const { addShape } = useAddShape(canvasRef.current || undefined); // Pass undefined if null

  useEffect(() => {
    const canvasElement = document.getElementById(
      "fabricCanvas"
    ) as HTMLCanvasElement;

    if (!canvasRef.current && canvasElement) {
      canvasRef.current = new fabric.Canvas(canvasElement);
    }

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.backgroundColor = backgroundColor;
      canvas.renderAll();

      if (selectedShape) {
        // Disable selection while drawing
        canvas.selection = false;

        // Add the selected shape dynamically
        addShape(selectedShape);

        // Re-enable selection after the shape is added
        setTimeout(() => {
          canvas.selection = true;
        }, 100); // Short delay to ensure drawing finishes before re-enabling

        // Reset the selected shape after adding it
        setSelectedShape(null);
      }
    }
  }, [
    width,
    height,
    backgroundColor,
    selectedShape,
    addShape,
    setSelectedShape,
  ]);

  return <canvas id="fabricCanvas" className="canvas" />;
};

export default Canvas;
