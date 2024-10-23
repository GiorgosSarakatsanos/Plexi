// ShapeProps.ts
export interface Shape {
  id: number;
  type: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
}
