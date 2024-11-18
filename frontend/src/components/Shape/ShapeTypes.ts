export interface Shape {
  id: string;
  type: "rect" | "ellipse" | "line" | "polygon";
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  sides?: number; // Add sides for polygons
  radius?: number; // Radius for polygons
  fill: string;
  stroke: string;
  strokeWidth: number;
  layerId: string;

}
