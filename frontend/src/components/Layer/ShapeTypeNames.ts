import { LuSquare, LuCircle, LuMinus, LuType, LuHexagon } from "react-icons/lu";
import { IconType } from "react-icons";

export const shapeTypeNames: {
  [key: string]: { name: string; icon: IconType };
} = {
  rect: { name: "Rectangle", icon: LuSquare },
  ellipse: { name: "Ellipse", icon: LuCircle },
  line: { name: "Line", icon: LuMinus },
  hexagon: { name: "Polygon", icon: LuHexagon },
  text: { name: "Text", icon: LuType },
  // Add more shape mappings here
};
