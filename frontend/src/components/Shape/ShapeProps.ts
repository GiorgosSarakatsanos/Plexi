import { RectConfig } from "konva/lib/shapes/Rect";
import { EllipseConfig } from "konva/lib/shapes/Ellipse";

export interface ShapeProps {
  type: string;
  defaultProps: RectConfig | EllipseConfig; // Extend this for other shapes as needed
}
