import {
  LuSquare,
  LuCircle,
  LuMinus,
  LuType,
  LuHexagon,
  LuFrame,
  LuImage,
  LuPencil,
} from "react-icons/lu";
import { IconType } from "react-icons";

export const shapeTypeNames: {
  [key: string]: { name: string; icon: IconType };
} = {
  rect: { name: "Rectangle", icon: LuSquare },
  ellipse: { name: "Ellipse", icon: LuCircle },
  hexagon: { name: "Polygon", icon: LuHexagon },
  line: { name: "Line", icon: LuMinus },
  pen: { name: "Pen", icon: LuPencil },
  text: { name: "Text", icon: LuType },
  area: { name: "Area", icon: LuFrame },
  image: { name: "Image", icon: LuImage },

  // Add more shape mappings here
};
