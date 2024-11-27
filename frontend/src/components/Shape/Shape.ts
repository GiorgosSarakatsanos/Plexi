export type Shape = {
  id: string;
  type:
    | "rect"
    | "ellipse"
    | "hexagon"
    | "line"
    | "pen"
    | "text"
    | "image"
    | "area";
  x: number;
  y: number;
  text?: string; // Used for "text" shapes
  width?: number; // Used for "rect", "ellipse", "text"
  height?: number; // Used for "rect", "ellipse", "text"
  points?: number[]; // Used for "line", "pen"
  fill: string;
  sides?: number;
  stroke: string;
  strokeWidth: number;
  layerId: string;
  fontSize?: number; // Used for "text"
  fontFamily?: string; // Used for "text"
  radius?: number; // Used for "ellipse", "hexagon"
  image?: HTMLImageElement; // Used for "image"
  groupId?: string; // Optional grouping
};
