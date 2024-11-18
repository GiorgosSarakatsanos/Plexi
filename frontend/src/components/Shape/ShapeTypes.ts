export interface Shape {
  id: string;
  type: "rect" | "ellipse" | "line";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  fill: string;
  stroke: string;
  strokeWidth: number;
}
