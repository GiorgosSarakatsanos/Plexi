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

  // Initialize the canvas and update its size and background color
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
    }
  }, [width, height, backgroundColor]);

  // Use the shape-adding hook outside of useEffect
  const { addShapeWithType } = useAddShape(canvasRef.current || undefined);

  // Ensure addShape logic only runs when selectedShape changes and after canvas is ready
  useEffect(() => {
    if (selectedShape && canvasRef.current) {
      addShapeWithType(selectedShape); // Add the shape dynamically

      setTimeout(() => {
        canvasRef.current!.selection = true; // Re-enable selection after adding shape
      }, 100);

      setSelectedShape(null); // Reset selected shape
    }
  }, [selectedShape, setSelectedShape, addShapeWithType]);

  return <canvas id="fabricCanvas" className="canvas" />;
};

export default Canvas;
