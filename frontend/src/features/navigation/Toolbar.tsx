import React from "react";
import Konva from "konva";
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
import { HStack, IconButton, VStack } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

import { SelectedShape } from "../design/helpers/ToolTypes";
import { useKeyboardShortcuts } from "../design/keyboardActions/useKeyboardShortcuts";
import { keyboardShortcuts } from "../design/keyboardActions/keyboardShortcuts";
import { ToolManager } from "../design/helpers/ToolManager";
import { uploadImage } from "../design/helpers/uploadImage";
import { ImageTool } from "../design/Tools/ImageTool";

interface ToolbarProps {
  selectedShape: SelectedShape;
  setSelectedShape: React.Dispatch<React.SetStateAction<SelectedShape>>;
  stageRef: React.RefObject<Konva.Stage>;
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
          ImageTool.setUploadedImage(uploadedImage);
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
    <VStack>
      <HStack p={2}>
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
              <Icon /> {/* Pass the icon component as a child */}
            </IconButton>
          </Tooltip>
        ))}
      </HStack>
    </VStack>
  );
};

export default Toolbar;
