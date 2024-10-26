export interface Position {
  x: number;
  y: number;
}

// ShapeTypes.ts
export interface Shape {
  id: string;
  type: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  layer: number; // Ensure that the layer property is present
}
