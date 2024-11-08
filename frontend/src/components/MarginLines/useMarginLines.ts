// hooks/useMarginLines.ts
import { useEffect, useRef } from "react";

interface UseMarginLinesProps {
  canvas: fabric.Canvas | null;
  width: number;
  height: number;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
  leftMargin: number;
  marginColor: string;
  lineStyle: "solid" | "dashed" | "dotted";
  dashArray: [number, number];
  opacity: number;
}

export const useMarginLines = ({
  canvas,
  width,
  height,
  topMargin,
  rightMargin,
  bottomMargin,
  leftMargin,
  marginColor,
  lineStyle,
  dashArray,
  opacity,
}: UseMarginLinesProps) => {
  const marginLinesRef = useRef<fabric.Line[]>([]);

  useEffect(() => {
    if (!canvas) return;

    // Remove existing margin lines if any
    marginLinesRef.current.forEach((line) => {
      canvas.remove(line);
    });
    marginLinesRef.current = [];

    const strokeDashArray =
      lineStyle === "dashed" || lineStyle === "dotted" ? dashArray : [];

    // Create margin lines based on the provided margins
    const leftLine = new fabric.Line(
      [leftMargin, topMargin, leftMargin, height - bottomMargin],
      {
        stroke: marginColor,
        strokeDashArray: strokeDashArray,
        opacity: opacity,
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
        strokeDashArray: strokeDashArray,
        opacity: opacity,
        selectable: false,
        evented: false,
      }
    );

    const topLine = new fabric.Line(
      [leftMargin, topMargin, width - rightMargin, topMargin],
      {
        stroke: marginColor,
        strokeDashArray: strokeDashArray,
        opacity: opacity,
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
        strokeDashArray: strokeDashArray,
        opacity: opacity,
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
    dashArray,
    opacity,
    lineStyle, // Ensure the canvas re-renders when lineStyle changes
  ]);
};
