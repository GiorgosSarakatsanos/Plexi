export interface RectangleData {
  type: "rect";
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeDashArray: number[];
  strokeWidth: number;
}

export interface CircleData {
  type: "circle";
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface LineData {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
}

export interface TextData {
  type: "i-text";
  text: string;
  fontSize: number;
  fill: string;
}

export const shapeDataMap: Record<
  string,
  RectangleData | CircleData | LineData | TextData
> = {
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
};
