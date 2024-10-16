// ShapeData.ts
import { ShapeData } from "./ShapeTypes";

// Shape Data Map
export const shapeDataMap: Record<string, ShapeData> = {
  rectangle: {
    type: "rect",
    width: 100,
    height: 50,
    fill: "transparent",
    stroke: "gray",
    strokeDashArray: [5, 5],
    strokeWidth: 4,
  },
  circle: {
    type: "circle",
    radius: 50,
    fill: "transparent",
    stroke: "blue",
    strokeWidth: 4,
  },
  line: {
    type: "line",
    x1: 0,
    y1: 0,
    x2: 200,
    y2: 200,
    stroke: "black",
    strokeWidth: 2,
  },
  "i-text": {
    type: "i-text",
    text: "Hello World",
    fontSize: 24,
    fill: "black",
  },
  triangle: {
    type: "triangle",
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: "red",
    strokeWidth: 4,
  },
};
