import React from "react";
import {
  LuMousePointer2,
  LuSquare,
  LuCircle,
  LuMinus,
  LuType,
  LuHexagon,
  LuImage,
  LuFrame,
  LuPencil,
} from "react-icons/lu";
import { HStack, IconButton } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { SelectedShape } from "../Tools/ToolTypes";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { keyboardShortcuts } from "../../config/keyboardShortcuts";

interface ToolbarProps {
  selectedShape: SelectedShape;
  setSelectedShape: React.Dispatch<React.SetStateAction<SelectedShape>>;
  handleUploadImage: () => void;
}

const shapeOptions = [
  { label: "Select", icon: LuMousePointer2, value: "select" },
  { label: "Rectangle", icon: LuSquare, value: "rect" },
  { label: "Ellipse", icon: LuCircle, value: "ellipse" },
  { label: "Hexagon", icon: LuHexagon, value: "hexagon" },
  { label: "Line", icon: LuMinus, value: "line" },
  { label: "Pen", icon: LuPencil, value: "pen" },
  { label: "Text", icon: LuType, value: "text" },
  { label: "Image", icon: LuImage, value: "image", onClick: true },
  { label: "Drawing area", icon: LuFrame, value: "area" },
];

const Toolbar: React.FC<ToolbarProps> = ({
  selectedShape,
  setSelectedShape,
  handleUploadImage,
}) => {
  const handleShapeSelection = (shapeType: SelectedShape) => {
    setSelectedShape(shapeType);
    if (shapeType === "image") {
      handleUploadImage();
    }
  };

  useKeyboardShortcuts(keyboardShortcuts(handleShapeSelection));

  return (
    <div className="toolbar-container">
      <HStack background={"bg.panel"} rounded={"full"} p={"2"}>
        {shapeOptions.map(({ label, icon: Icon, value }) => (
          <Tooltip key={value} showArrow content={label}>
            <IconButton
              aria-label={label}
              onClick={() => handleShapeSelection(value as SelectedShape)}
              variant={selectedShape === value ? "solid" : "ghost"}
              rounded="full"
              size="xs"
              colorPalette="blue"
            >
              <Icon />
            </IconButton>
          </Tooltip>
        ))}
      </HStack>
    </div>
  );
};

export default Toolbar;
