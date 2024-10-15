import React, { useRef, useEffect } from "react";
import "./Canvas.css"; // Import the external CSS file

interface CanvasProps {
  width: number; // The original width of the canvas
  height: number; // The original height of the canvas
  backgroundColor: string;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, backgroundColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const aspectRatio = width / height;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ratio = window.devicePixelRatio || 1; // Get the pixel ratio

    if (canvas) {
      // Set the actual canvas width and height to match the original dimensions
      canvas.width = width * ratio;
      canvas.height = height * ratio;

      const context = canvas.getContext("2d");
      if (context) {
        context.scale(ratio, ratio);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);
      }

      // Set the CSS variable for the dynamic width
      canvas.style.setProperty("--canvas-width", `${700 * aspectRatio}px`);
    }
  }, [width, height, backgroundColor, aspectRatio]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas" // Apply the external CSS class
    />
  );
};

export default Canvas;
