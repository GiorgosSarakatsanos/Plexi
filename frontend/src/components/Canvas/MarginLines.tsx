// MarginLines.tsx
import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

interface MarginLinesProps {
  canvas: fabric.Canvas | null;
  width: number;
  height: number;
  visible: boolean;
}

const MarginLines: React.FC<MarginLinesProps> = ({
  canvas,
  width,
  height,
  visible,
}) => {
  const margin = 24; // Margin in pixels

  const marginLinesRef = useRef<fabric.Line[]>([]);

  useEffect(() => {
    if (!canvas) return;

    // Remove existing margin lines if any
    marginLinesRef.current.forEach((line) => {
      canvas.remove(line);
    });
    marginLinesRef.current = [];

    if (visible) {
      // Create margin lines 24px from the edges
      const leftLine = new fabric.Line(
        [margin, margin, margin, height - margin],
        {
          stroke: "red",
          selectable: false,
          evented: false,
        }
      );
      const rightLine = new fabric.Line(
        [width - margin, margin, width - margin, height - margin],
        {
          stroke: "red",
          selectable: false,
          evented: false,
        }
      );
      const topLine = new fabric.Line(
        [margin, margin, width - margin, margin],
        {
          stroke: "red",
          selectable: false,
          evented: false,
        }
      );
      const bottomLine = new fabric.Line(
        [margin, height - margin, width - margin, height - margin],
        {
          stroke: "red",
          selectable: false,
          evented: false,
        }
      );

      // Add lines to canvas
      canvas.add(leftLine, rightLine, topLine, bottomLine);

      // Store the lines to remove them later if needed
      marginLinesRef.current = [leftLine, rightLine, topLine, bottomLine];
    }

    // Render the canvas
    canvas.renderAll();
  }, [canvas, width, height, visible]);

  return null;
};

export default MarginLines;
