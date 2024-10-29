import { RectConfig } from "konva/lib/shapes/Rect";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";
import { Shape } from "./ShapeTypes"; // Import the shared Shape interface

// Base shape configuration for common props
const baseShapeProps = {
  fill: "transparent",
  stroke: "blue", // Merged stroke color
  strokeWidth: 2, // Merged stroke width
  draggable: true,
};

// Unified shape map for all types of shapes
export const shapeMap: Record<
  string,
  {
    type: string;
    defaultProps: Partial<RectConfig | EllipseConfig | LineConfig>;
    createShape: (
      startPos: { x: number; y: number },
      endPos: { x: number; y: number }
    ) => Partial<Shape>;
  }
> = {
  rect: {
    type: "rect",
    defaultProps: baseShapeProps,
    createShape: (startPos, endPos): Partial<Shape> => ({
      width: endPos.x - startPos.x,
      height: endPos.y - startPos.y,
    }),
  },
  ellipse: {
    type: "ellipse",
    defaultProps: baseShapeProps,
    createShape: (startPos, endPos): Partial<Shape> => ({
      radiusX: Math.abs(endPos.x - startPos.x) / 2,
      radiusY: Math.abs(endPos.y - startPos.y) / 2,
      position: {
        x: (startPos.x + endPos.x) / 2, // Calculate center point
        y: (startPos.y + endPos.y) / 2,
      },
    }),
  },
  line: {
    type: "line",
    defaultProps: baseShapeProps,
    createShape: (startPos, endPos): Partial<Shape> => {
      // Adjusted points for line to correct positioning
      return {
        points: [
          startPos.x,
          startPos.y, // Start point
          endPos.x,
          endPos.y, // End point
        ],
      };
    },
  },
  triangle: {
    type: "triangle",
    defaultProps: baseShapeProps,
    createShape: (startPos, endPos): Partial<Shape> => {
      const midX = (startPos.x + endPos.x) / 2;
      return {
        // Adjusted points for triangle to center the shape
        points: [
          midX,
          startPos.y, // Top middle
          endPos.x,
          endPos.y, // Bottom right
          startPos.x,
          endPos.y, // Bottom left
          midX,
          startPos.y, // Close the triangle (back to top middle)
        ],
      };
    },
  },
};
