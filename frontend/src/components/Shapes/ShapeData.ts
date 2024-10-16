// ShapeData.ts
import { ShapeData } from "./ShapeTypes";
import { rectangleData } from "./RectangleData";
import { circleData } from "./CircleData";
import { lineData } from "./LineData";
import { textData } from "./TextData"; // Similarly for text shapes
import { triangleData } from "./TriangleData";
import { polylineData } from "./PolylineData";  // For triangle shapes

export const shapeDataMap: Record<string, ShapeData> = {
  rectangle: rectangleData,
  circle: circleData,
  line: lineData,
  "i-text": textData,
  triangle: triangleData,
   polyline: polylineData,
};
