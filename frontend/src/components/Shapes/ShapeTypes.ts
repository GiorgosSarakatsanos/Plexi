// ShapeTypes.ts

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

// Add TriangleData interface
export interface TriangleData {
  type: "triangle";
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface PolylineData {
  type: "polyline";
  points: { x: number; y: number }[];
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// Create a union type for all shape data
export type ShapeData =
  | RectangleData
  | CircleData
  | LineData
  | TextData
  | TriangleData
  | PolylineData;
