import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

interface CanvasComponentProps {
  width: number;
  height: number;
  addBox: boolean;
  setAddBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  width,
  height,
  addBox,
  setAddBox,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas element
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null); // Fabric.js canvas instance

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabricCanvasRef.current = canvas;

    // Clean up Fabric.js canvas on unmount
    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      // Update canvas dimensions dynamically based on props
      fabricCanvasRef.current.setWidth(width);
      fabricCanvasRef.current.setHeight(height);
    }
  }, [width, height]); // Trigger when width or height changes

  // Effect to handle adding a box when the button is clicked
  useEffect(() => {
    if (addBox && fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;

      // Calculate 1/8 of canvas size for box width and height
      const boxWidth = width / 8;
      const boxHeight = height / 8;

      // Create the rectangle with the specified properties
      const rect = new fabric.Rect({
        left: width / 2 - boxWidth / 2, // Center the box
        top: height / 2 - boxHeight / 2, // Center the box
        width: boxWidth,
        height: boxHeight,
        fill: "transparent", // No fill color
        stroke: "blue", // Blue dashed line when selected
        strokeDashArray: [5, 5], // Dashed stroke
        strokeWidth: 2,
        rx: 4, // Border radius of 4px
        ry: 4, // Border radius of 4px
        selectable: true, // Make it selectable
        hasControls: true, // Allow moving and resizing
        cornerStyle: "circle", // Optional: Circular corners for resizing
      });

      // Add the rectangle to the canvas
      canvas.add(rect);

      // Ensure the rectangle is selected
      canvas.setActiveObject(rect);

      // Add event to change stroke color when deselected
      rect.on("deselected", () => {
        rect.set({ stroke: "gray" }); // Gray border when unselected
        canvas.renderAll(); // Re-render the canvas
      });

      // Change stroke back to blue when selected
      rect.on("selected", () => {
        rect.set({ stroke: "blue" });
        canvas.renderAll();
      });

      setAddBox(false); // Reset the state to avoid re-adding the box
    }
  }, [addBox, width, height, setAddBox]); // Trigger this effect when addBox changes

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default CanvasComponent;
