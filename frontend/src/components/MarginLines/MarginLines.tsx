// MarginLines.tsx
import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

interface MarginLinesProps {
  canvas: fabric.Canvas | null;
  width: number;
  height: number;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
  leftMargin: number;
  marginColor: string;
  lineStyle: "solid" | "dashed" | "dotted";
  dashPattern: number[];
  opacity: number;
  visible: boolean; // Add visible prop
}

const MarginLines: React.FC<MarginLinesProps> = ({
  canvas,
  width,
  height,
  topMargin,
  rightMargin,
  bottomMargin,
  leftMargin,
  marginColor,
  lineStyle,
  dashPattern,
  opacity,
  visible, // Check for visibility
}) => {
  const marginLinesRef = useRef<fabric.Line[]>([]);

  useEffect(() => {
    if (!canvas) return;

    // Remove existing margin lines if any
    marginLinesRef.current.forEach((line) => {
      canvas.remove(line);
    });
    marginLinesRef.current = [];

    // If margin lines are not visible, exit early and do not create new lines
    if (!visible) {
      canvas.renderAll();
      return;
    }

    // Define strokeDashArray for line styles
    const strokeDashArray = lineStyle === "solid" ? undefined : dashPattern;

    // Create margin lines based on the provided margins and styles
    const leftLine = new fabric.Line(
      [leftMargin, topMargin, leftMargin, height - bottomMargin],
      {
        stroke: marginColor,
        strokeDashArray,
        opacity,
        selectable: false,
        evented: false,
      }
    );
    const rightLine = new fabric.Line(
      [
        width - rightMargin,
        topMargin,
        width - rightMargin,
        height - bottomMargin,
      ],
      {
        stroke: marginColor,
        strokeDashArray,
        opacity,
        selectable: false,
        evented: false,
      }
    );
    const topLine = new fabric.Line(
      [leftMargin, topMargin, width - rightMargin, topMargin],
      {
        stroke: marginColor,
        strokeDashArray,
        opacity,
        selectable: false,
        evented: false,
      }
    );
    const bottomLine = new fabric.Line(
      [
        leftMargin,
        height - bottomMargin,
        width - rightMargin,
        height - bottomMargin,
      ],
      {
        stroke: marginColor,
        strokeDashArray,
        opacity,
        selectable: false,
        evented: false,
      }
    );

    // Add lines to canvas
    canvas.add(leftLine, rightLine, topLine, bottomLine);

    // Store the lines so they can be removed later
    marginLinesRef.current = [leftLine, rightLine, topLine, bottomLine];

    // Render the canvas with new margins
    canvas.renderAll();
  }, [
    canvas,
    width,
    height,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
    marginColor,
    lineStyle,
    dashPattern,
    opacity,
    visible, // Trigger useEffect when visibility changes
  ]);

  return null;
};

export default MarginLines;
