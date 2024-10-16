// ShapeData.ts
import { ShapeData } from "./ShapeTypes";
import { rectangleData } from "./Rectangle/RectangleData";
import { circleData } from "./Ellipse/EllipseData";
import { lineData } from "./Line/LineData";
import { textData } from "./Text/TextData"; // Similarly for text shapes
import { triangleData } from "./Triangle/TriangleData";
import { polylineData } from "./Polyline/PolylineData"; // For triangle shapes

export const shapeDataMap: Record<string, ShapeData> = {
  rectangle: rectangleData,
  circle: circleData,
  line: lineData,
  "i-text": textData,
  triangle: triangleData,
  polyline: polylineData,
};
