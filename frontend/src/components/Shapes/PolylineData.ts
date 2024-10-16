// PolylineData.ts
import { PolylineData } from "./ShapeTypes";

export const polylineData: PolylineData = {
  type: "polyline",
  points: [
    { x: 0, y: 0 },
    { x: 50, y: 50 },
    { x: 100, y: 0 },
    { x: 150, y: 50 },
  ],
  stroke: "purple",
  strokeWidth: 4,
  fill: "transparent",
};
