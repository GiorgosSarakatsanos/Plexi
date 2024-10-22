import React from "react";
import { Line } from "react-konva";

interface MarginLinesProps {
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
  // If the margin lines are not visible, return null
  if (!visible) {
    return null;
  }

  // Define strokeDashArray for line styles
  const strokeDashArray = lineStyle === "solid" ? [] : dashPattern;

  return (
    <>
      {/* Left Line */}
      <Line
        points={[leftMargin, topMargin, leftMargin, height - bottomMargin]}
        stroke={marginColor}
        strokeWidth={1}
        dash={strokeDashArray}
        opacity={opacity}
        listening={false} // Disable events
      />
      {/* Right Line */}
      <Line
        points={[
          width - rightMargin,
          topMargin,
          width - rightMargin,
          height - bottomMargin,
        ]}
        stroke={marginColor}
        strokeWidth={1}
        dash={strokeDashArray}
        opacity={opacity}
        listening={false}
      />
      {/* Top Line */}
      <Line
        points={[leftMargin, topMargin, width - rightMargin, topMargin]}
        stroke={marginColor}
        strokeWidth={1}
        dash={strokeDashArray}
        opacity={opacity}
        listening={false}
      />
      {/* Bottom Line */}
      <Line
        points={[
          leftMargin,
          height - bottomMargin,
          width - rightMargin,
          height - bottomMargin,
        ]}
        stroke={marginColor}
        strokeWidth={1}
        dash={strokeDashArray}
        opacity={opacity}
        listening={false}
      />
    </>
  );
};

export default MarginLines;
