import { SelectedShape } from "../components/Tools/ToolTypes";

export const keyboardShortcuts = (
  handleShapeSelection: (shapeType: SelectedShape) => void
) => ({
  s: () => handleShapeSelection("select"),
  r: () => handleShapeSelection("rect"),
  e: () => handleShapeSelection("ellipse"),
  h: () => handleShapeSelection("hexagon"),
  l: () => handleShapeSelection("line"),
  b: () => handleShapeSelection("pen"),
  t: () => handleShapeSelection("text"),
  q: () => handleShapeSelection("image"),
  a: () => handleShapeSelection("area"),
});
