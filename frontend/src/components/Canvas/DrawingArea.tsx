import React, { useState, useRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { LuPrinter, LuPencil } from "react-icons/lu";
import Konva from "konva";

interface DrawingAreaProps {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number; // Zoom level for scaling adjustments
  onDeselect?: () => void; // Callback for deselection
}

const DrawingArea: React.FC<DrawingAreaProps> = ({
  x,
  y,
  width,
  height,
  scale,
  onDeselect,
}) => {
  const [isPrinterHovered, setIsPrinterHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [rectProps, setRectProps] = useState({ x, y, width, height });

  const rectRef = useRef<Konva.Rect>(null); // Reference to the rectangle
  const trRef = useRef<Konva.Transformer>(null); // Reference to the transformer

  const handleEditClick = () => {
    setIsEditable(true);

    // Add null checks for rectRef and trRef
    if (rectRef.current && trRef.current) {
      const transformer = trRef.current;
      const rectangle = rectRef.current;

      transformer.nodes([rectangle]);
      transformer.getLayer()?.batchDraw(); // Add optional chaining for safety
    }
  };

  const handleDragMove = () => {
    if (rectRef.current) {
      const { x, y } = rectRef.current.position();
      setRectProps((prev) => ({ ...prev, x, y }));
    }
  };

  const handleTransform = () => {
    if (rectRef.current) {
      const node = rectRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      const newWidth = node.width() * scaleX;
      const newHeight = node.height() * scaleY;
      const { x, y } = node.position();

      // Reset scaling for future transformations
      node.scaleX(1);
      node.scaleY(1);

      setRectProps({ x, y, width: newWidth, height: newHeight });
    }
  };

  // Listen for clicks outside of the DrawingArea to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!rectRef.current) return;

      const stage = rectRef.current.getStage();

      if (!stage) return; // Ensure stage is not null

      const target = e.target as HTMLElement;

      // Check if the click is outside the Konva stage or shapes
      const clickedOnStage = stage.content === target;

      if (clickedOnStage && isEditable) {
        setIsEditable(false);
        if (trRef.current) {
          trRef.current.nodes([]);
          trRef.current.getLayer()?.batchDraw();
        }
        if (onDeselect) {
          onDeselect();
        }
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isEditable, onDeselect]);

  const adjustedX = rectProps.x * scale;
  const adjustedY = rectProps.y * scale;
  const adjustedWidth = rectProps.width * scale;

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
            pointerEvents: "auto",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
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
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              marginRight: `${10 / scale}px`,
            }}
            onClick={handleEditClick} // Toggle edit mode
          >
            <LuPencil size={12 / scale} color="gray" />
          </div>
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
      </Html>

      {/* DrawingArea Rectangle */}
      <Rect
        ref={rectRef}
        x={rectProps.x}
        y={rectProps.y}
        width={rectProps.width}
        height={rectProps.height}
        fill="white"
        stroke={isEditable ? "blue" : "lightgray"}
        strokeWidth={2 / scale}
        draggable={isEditable} // Allow dragging when in edit mode
        onDragMove={handleDragMove}
        onTransform={handleTransform}
      />

      {/* Transformer for resizing and rotating */}
      {isEditable && <Transformer ref={trRef} />}
    </>
  );
};

export default DrawingArea;
