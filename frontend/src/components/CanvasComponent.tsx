import React, { useEffect, useRef, useCallback, useState } from "react";
import * as fabric from "fabric";
import Input from "../components/Input";

interface CanvasComponentProps {
  width: number;
  height: number;
  addBox: boolean;
  setAddBox: React.Dispatch<React.SetStateAction<boolean>>;
  backgroundColor: string;
  unit: "mm" | "cm" | "inches" | "pixels";
}

const unitConversion = {
  pixels: 1,
  mm: 3.78,
  cm: 37.8,
  inches: 96,
};

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  width,
  height,
  addBox,
  setAddBox,
  backgroundColor,
  unit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const linesRef = useRef<fabric.Line[]>([]);
  const [distances, setDistances] = useState({
    left: "",
    top: "",
    right: "",
    bottom: "",
  });
  const [inputPositions, setInputPositions] = useState({
    left: { x: 0, y: 0 },
    top: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
    bottom: { x: 0, y: 0 },
  });

  const [locked, setLocked] = useState({
    left: false,
    top: false,
    right: false,
    bottom: false,
  }); // To manage locked state for each side

  // useRef for storing timeout IDs
  const timeoutRefs = {
    left: useRef<ReturnType<typeof setTimeout> | null>(null),
    top: useRef<ReturnType<typeof setTimeout> | null>(null),
    right: useRef<ReturnType<typeof setTimeout> | null>(null),
    bottom: useRef<ReturnType<typeof setTimeout> | null>(null),
  };

  const convertToUnit = useCallback(
    (pixels: number) => {
      return (pixels / unitConversion[unit]).toFixed(2);
    },
    [unit]
  );

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabricCanvasRef.current = canvas;

    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setWidth(width);
      fabricCanvasRef.current.setHeight(height);
    }
  }, [width, height]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.backgroundColor = backgroundColor;
      fabricCanvasRef.current.renderAll();
    }
  }, [backgroundColor]);

  const updateLines = useCallback(
    (rect: fabric.Rect) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !rect) return;

      linesRef.current.forEach((line) => canvas.remove(line));
      linesRef.current = [];

      const rectLeft = rect.left!;
      const rectTop = rect.top!;
      const rectWidth = rect.width! * rect.scaleX!;
      const rectHeight = rect.height! * rect.scaleY!;
      const rectRight = rectLeft + rectWidth;
      const rectBottom = rectTop + rectHeight;
      const rectCenterX = rectLeft + rectWidth / 2;
      const rectCenterY = rectTop + rectHeight / 2;

      // Calculate distances
      const leftDistance = rectLeft;
      const topDistance = rectTop;
      const rightDistance = width - rectRight;
      const bottomDistance = height - rectBottom;

      setDistances({
        left: convertToUnit(leftDistance),
        top: convertToUnit(topDistance),
        right: convertToUnit(rightDistance),
        bottom: convertToUnit(bottomDistance),
      });

      // Pink dashed lines (left, top, right, bottom)
      const leftLine = new fabric.Line(
        [rectLeft, rectCenterY, 0, rectCenterY],
        {
          stroke: "pink",
          strokeDashArray: [5, 5],
          selectable: false,
        }
      );
      canvas.add(leftLine);
      linesRef.current.push(leftLine);

      const topLine = new fabric.Line([rectCenterX, rectTop, rectCenterX, 0], {
        stroke: "pink",
        strokeDashArray: [5, 5],
        selectable: false,
      });
      canvas.add(topLine);
      linesRef.current.push(topLine);

      const rightLine = new fabric.Line(
        [rectRight, rectCenterY, width, rectCenterY],
        {
          stroke: "pink",
          strokeDashArray: [5, 5],
          selectable: false,
        }
      );
      canvas.add(rightLine);
      linesRef.current.push(rightLine);

      const bottomLine = new fabric.Line(
        [rectCenterX, rectBottom, rectCenterX, height],
        {
          stroke: "pink",
          strokeDashArray: [5, 5],
          selectable: false,
        }
      );
      canvas.add(bottomLine);
      linesRef.current.push(bottomLine);

      // Calculate input positions
      setInputPositions({
        left: {
          x: -60, // Adjust for input width
          y: rectCenterY - 10, // Adjust for input height
        },
        top: {
          x: rectCenterX - 25, // Adjust for input width
          y: -28,
        },
        right: {
          x: rectRight + (width - rectRight) + 4,
          y: rectCenterY - 10,
        },
        bottom: {
          x: rectCenterX - 25,
          y: rectBottom + (height - rectBottom),
        },
      });
    },
    [width, height, convertToUnit]
  );

  const handleDistanceChange =
    (side: "left" | "top" | "right" | "bottom") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (locked[side]) return; // Prevent changes if locked

      const value = e.target.value;
      setDistances((prevDistances) => ({
        ...prevDistances,
        [side]: value,
      }));

      if (timeoutRefs[side].current) {
        clearTimeout(timeoutRefs[side].current!);
      }

      timeoutRefs[side].current = setTimeout(() => {
        const newDistance = parseFloat(value) * unitConversion[unit];

        if (
          fabricCanvasRef.current &&
          fabricCanvasRef.current.getActiveObject()
        ) {
          const rect = fabricCanvasRef.current.getActiveObject() as fabric.Rect;
          if (side === "left") {
            rect.left = newDistance;
          } else if (side === "top") {
            rect.top = newDistance;
          } else if (side === "right") {
            rect.left = width - newDistance - rect.width! * rect.scaleX!;
          } else if (side === "bottom") {
            rect.top = height - newDistance - rect.height! * rect.scaleY!;
          }
          fabricCanvasRef.current.renderAll();
          updateLines(rect);
        }
      }, 1500); // Delay before applying the distance
    };

  // Toggle the lock/unlock state for a side
  const toggleLock = (side: "left" | "top" | "right" | "bottom") => {
    setLocked((prevLocked) => ({
      ...prevLocked,
      [side]: !prevLocked[side],
    }));
  };

  useEffect(() => {
    if (addBox && fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;

      const boxWidth = width / 8;
      const boxHeight = height / 8;

      const rect = new fabric.Rect({
        left: width / 2 - boxWidth / 2,
        top: height / 2 - boxHeight / 2,
        width: boxWidth,
        height: boxHeight,
        fill: "transparent",
        stroke: "blue",
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        rx: 4,
        ry: 4,
        selectable: true,
        hasControls: true,
        cornerStyle: "circle",
      });

      canvas.add(rect);
      updateLines(rect);

      canvas.setActiveObject(rect);

      rect.on("moving", () => updateLines(rect));
      rect.on("scaling", () => updateLines(rect));

      rect.on("deselected", () => {
        rect.set({ stroke: "gray" });
        canvas.renderAll();
      });

      rect.on("selected", () => {
        rect.set({ stroke: "blue" });
        canvas.renderAll();
      });

      setAddBox(false);
    }
  }, [addBox, width, height, setAddBox, updateLines]);

  return (
    <div style={{ position: "relative", width: width, height: height }}>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
      {/* Render inputs and lock buttons over the canvas */}
      {["left", "top", "right", "bottom"].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: inputPositions[side as "left" | "top" | "right" | "bottom"].x,
            top: inputPositions[side as "left" | "top" | "right" | "bottom"].y,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            value={distances[side as "left" | "top" | "right" | "bottom"]}
            onChange={handleDistanceChange(
              side as "left" | "top" | "right" | "bottom"
            )}
            placeholder={`${side} distance`}
            disabled={locked[side as "left" | "top" | "right" | "bottom"]}
          />
          <button
            onClick={() =>
              toggleLock(side as "left" | "top" | "right" | "bottom")
            }
            style={{ marginLeft: "5px" }}
          >
            {locked[side as "left" | "top" | "right" | "bottom"] ? "🔒" : "🔓"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CanvasComponent;
