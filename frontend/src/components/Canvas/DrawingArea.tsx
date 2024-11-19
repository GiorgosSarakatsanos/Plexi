import React, { useState } from "react";
import { Rect } from "react-konva";
import { Html } from "react-konva-utils";
import { LuPrinter } from "react-icons/lu";

interface DrawingAreaProps {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number; // Zoom level for scaling adjustments
}

const DrawingArea: React.FC<DrawingAreaProps> = ({
  x,
  y,
  width,
  height,
  scale,
}) => {
  const [isPrinterHovered, setIsPrinterHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const adjustedX = x * scale;
  const adjustedY = y * scale;
  const adjustedWidth = width * scale;
  const adjustedHeight = height * scale;

  return (
    <>
      {/* Container positioned relative to the DrawingArea */}
      <Html
        divProps={{
          style: {
            position: "absolute",
            top: `${adjustedY}px`,
            left: `${adjustedX}px`,
            width: `${adjustedWidth}px`,
            height: `${adjustedHeight}px`,
            pointerEvents: "auto",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            backgroundColor: "transparent", // Optional: Background for the container
            border: `${2 / scale}px solid transparent`,
          },
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${4 / scale}px`,
            borderBottom: `${1 / scale}px solid lightgray`,
          }}
        >
          <input
            type="text"
            placeholder="Drawing area"
            style={{
              flex: 1,
              height: `${18 / scale}px`,
              color: `rgba(128, 128, 128, ${isInputFocused ? 1 : 0.4})`,
              padding: `${2 / scale}px`,
              fontSize: `${9 / scale}px`,
              background: "transparent",
              marginRight: `${10 / scale}px`,
            }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={() => setIsPrinterHovered(true)}
            onMouseLeave={() => setIsPrinterHovered(false)}
            onClick={() => {
              console.log("Printing this area...");
            }}
          >
            <LuPrinter
              size={12 / scale}
              color={`rgba(128, 128, 128, ${isPrinterHovered ? 1 : 0.4})`}
            />
          </div>
        </div>

        {/* Drawing Area Section */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white",
            border: "1px solid gray",
            borderRadius: "2px",
          }}
        >
          {/* Drawing Area Rectangle */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height - 30 / scale} // Adjusted height for the drawing area
            fill="white"
            stroke="transparent"
          />
        </div>
      </Html>
    </>
  );
};

export default DrawingArea;
