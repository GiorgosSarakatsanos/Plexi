// Canvas.tsx
import React, { useRef, useEffect } from "react";
import * as fabric from "fabric";
import { useAddShape } from "../Shapes/useAddShape";
import { shapeDataMap } from "../Shapes/ShapeDataMap";
import MarginLines from "../MarginLines/MarginLines";
import { marginSettings } from "../MarginLines/MarginSettings"; // Import margin settings

interface CanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
  selectedShape: keyof typeof shapeDataMap | null;
  setSelectedShape: React.Dispatch<
    React.SetStateAction<keyof typeof shapeDataMap | null>
  >;
  showMarginLines: boolean;
  margins: { top: string; right: string; bottom: string; left: string }; // Margin values
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor,
  selectedShape,
  setSelectedShape,
  showMarginLines,
  margins,
}) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

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

  const { addShapeWithType } = useAddShape(canvasRef.current || undefined);

  useEffect(() => {
    if (selectedShape && canvasRef.current) {
      addShapeWithType(selectedShape);
      setTimeout(() => {
        canvasRef.current!.selection = true;
      }, 100);
      setSelectedShape(null);
    }
  }, [selectedShape, setSelectedShape, addShapeWithType]);

  return (
    <div>
      <canvas id="fabricCanvas" className="canvas" />
      <MarginLines
        canvas={canvasRef.current}
        width={width}
        height={height}
        topMargin={parseInt(margins.top, 10)}
        rightMargin={parseInt(margins.right, 10)}
        bottomMargin={parseInt(margins.bottom, 10)}
        leftMargin={parseInt(margins.left, 10)}
        marginColor={marginSettings.marginColor}
        lineStyle={marginSettings.lineStyle}
        dashPattern={marginSettings.dashPattern}
        opacity={marginSettings.opacity}
        visible={showMarginLines} // Pass visibility state
      />
    </div>
  );
};

export default Canvas;
