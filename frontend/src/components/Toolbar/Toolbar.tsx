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
import { ToolManager } from "../Tools/ToolManager";
import Konva from "konva";
import { uploadImage } from "../../utils/uploadImage";
import { ImageTool } from "../Tools/ImageTool";

interface ToolbarProps {
  selectedShape: SelectedShape;
  setSelectedShape: React.Dispatch<React.SetStateAction<SelectedShape>>;
  stageRef: React.RefObject<Konva.Stage>; // Pass stageRef as a prop
}

const shapeOptions = [
  { label: "Select (S)", icon: LuMousePointer2, value: "select" },
  { label: "Rectangle (R)", icon: LuSquare, value: "rect" },
  { label: "Ellipse (E)", icon: LuCircle, value: "ellipse" },
  { label: "Hexagon (H)", icon: LuHexagon, value: "hexagon" },
  { label: "Line (L)", icon: LuMinus, value: "line" },
  { label: "Pen (B)", icon: LuPencil, value: "pen" },
  { label: "Text (T)", icon: LuType, value: "text" },
  { label: "Image (Q)", icon: LuImage, value: "image" },
  { label: "Drawing area (A)", icon: LuFrame, value: "area" },
];

const Toolbar: React.FC<ToolbarProps> = ({
  selectedShape,
  setSelectedShape,
  stageRef,
}) => {
  const handleShapeSelection = async (shapeType: SelectedShape) => {
    setSelectedShape(shapeType);

    if (shapeType === "image") {
      const imageUrl = await uploadImage();
      if (!imageUrl) {
        console.log("Image upload canceled or failed.");
        return;
      }

      const uploadedImage = new Image();
      uploadedImage.src = imageUrl;

      uploadedImage.onload = () => {
        if (ImageTool.setUploadedImage) {
          ImageTool.setUploadedImage(uploadedImage); // Pass only the uploaded image
        }
      };
    } else {
      const tool = ToolManager[shapeType];
      if (tool.onSelect && stageRef.current) {
        await tool.onSelect(stageRef.current);
      }
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
