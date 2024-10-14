import React, { useRef, useEffect } from "react";

interface CanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, backgroundColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set the canvas drawing size
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (context) {
        // Clear the canvas before re-rendering
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Set new canvas background color
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height); // Apply the background color with new dimensions
      }
    }
  }, [width, height, backgroundColor]); // Re-run effect when width, height, or backgroundColor change

  return (
    <canvas
      ref={canvasRef}
      width={width} // These control the pixel drawing size
      height={height}
      style={{
        border: "1px solid #000",
        display: "block",
        margin: "0 auto",
        width: `${width}px`, // This controls the CSS size
        height: `${height}px`, // Match both drawing and CSS size
      }}
    />
  );
};

export default Canvas;
