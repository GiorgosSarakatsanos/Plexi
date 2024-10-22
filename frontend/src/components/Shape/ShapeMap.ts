import { RectConfig } from "konva/lib/shapes/Rect";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";
import { LineConfig } from "konva/lib/shapes/Line";

// Define shape-specific configurations
interface RectShapeConfig {
  width: number;
  height: number;
}

interface EllipseShapeConfig {
  radiusX: number;
  radiusY: number;
}

interface LineShapeConfig {
  points: number[];
}

// Create a unified shape map for all types of shapes
export const shapeMap: Record<
  string,
  {
    type: string;
    defaultProps: Omit<
      RectConfig | EllipseConfig | LineConfig,
      "width" | "height" | "radiusX" | "radiusY" | "points"
    >;
    createShape: (
      startPos: { x: number; y: number },
      endPos: { x: number; y: number }
    ) => RectShapeConfig | EllipseShapeConfig | LineShapeConfig;
  }
> = {
  rect: {
    type: "rect",
    defaultProps: {
      fill: "transparent",
      stroke: "blue",
      strokeWidth: 2,
      draggable: false,
    } as Omit<RectConfig, "width" | "height">,
    createShape: (startPos, endPos): RectShapeConfig => ({
      width: endPos.x - startPos.x,
      height: endPos.y - startPos.y,
    }),
  },
  ellipse: {
    type: "ellipse",
    defaultProps: {
      fill: "transparent",
      stroke: "blue",
      strokeWidth: 2,
      draggable: false,
    } as Omit<EllipseConfig, "radiusX" | "radiusY">,
    createShape: (startPos, endPos): EllipseShapeConfig => ({
      radiusX: Math.abs(endPos.x - startPos.x) / 2,
      radiusY: Math.abs(endPos.y - startPos.y) / 2,
    }),
  },
  line: {
    type: "line",
    defaultProps: {
      stroke: "red",
      strokeWidth: 2,
      draggable: false,
    } as Omit<LineConfig, "points">,
    createShape: (startPos, endPos): LineShapeConfig => ({
      points: [startPos.x, startPos.y, endPos.x, endPos.y],
    }),
  },
  triangle: {
    type: "triangle",
    defaultProps: {
      stroke: "green",
      strokeWidth: 2,
      draggable: false,
    } as Omit<LineConfig, "points">,
    createShape: (startPos, endPos): LineShapeConfig => ({
      points: [
        startPos.x,
        endPos.y, // Bottom left
        endPos.x,
        endPos.y, // Bottom right
        (startPos.x + endPos.x) / 2,
        startPos.y, // Top middle
      ],
    }),
  },
};
