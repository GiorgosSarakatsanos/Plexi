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
} from "react-icons/lu";
import { HStack, IconButton } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { SelectedShape } from "../Shape/ToolTypes";

interface ToolbarProps {
  selectedShape: SelectedShape;
  setSelectedShape: React.Dispatch<React.SetStateAction<SelectedShape>>;
  handleUploadImage: () => void; // Add this
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedShape,
  setSelectedShape,
  handleUploadImage,
}) => {
  const handleShapeSelection = (shapeType: SelectedShape) => {
    console.log("Selected shape:", shapeType); // Debugging
    setSelectedShape(shapeType);
  };

  return (
    <div className="toolbar-container">
      <HStack background={"bg.panel"} rounded={"full"} p={"2"}>
        <Tooltip showArrow content={"Select"}>
          <IconButton
            aria-label="Select"
            onClick={() => handleShapeSelection("select")}
            variant={selectedShape === "select" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            colorPalette="blue"
          >
            <LuMousePointer2 />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Rectangle"}>
          <IconButton
            aria-label="Rectangle"
            onClick={() => handleShapeSelection("rect")}
            variant={selectedShape === "rect" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            borderColor="var(--chakra-colors-blue-500)"
            colorPalette="blue"
          >
            <LuSquare />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Ellipse"}>
          <IconButton
            aria-label="Ellipse"
            onClick={() => handleShapeSelection("ellipse")}
            variant={selectedShape === "ellipse" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            borderColor="var(--chakra-colors-blue-500)"
            colorPalette="blue"
          >
            <LuCircle />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Hexagon"}>
          <IconButton
            aria-label="Hexagon"
            onClick={() => handleShapeSelection("hexagon")}
            variant={selectedShape === "hexagon" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            borderColor="var(--chakra-colors-blue-500)"
            colorPalette="blue"
          >
            <LuHexagon />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Line"}>
          <IconButton
            aria-label="Line"
            onClick={() => handleShapeSelection("line")}
            variant={selectedShape === "line" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            borderColor="var(--chakra-colors-blue-500)"
            colorPalette="blue"
          >
            <LuMinus />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Text"}>
          <IconButton
            aria-label="Text"
            onClick={() => handleShapeSelection("text")}
            variant={selectedShape === "text" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            borderColor="var(--chakra-colors-blue-500)"
            colorPalette="blue"
          >
            <LuType />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Image"}>
          <IconButton
            aria-label="Image"
            onClick={() => {
              setSelectedShape("image");
              handleUploadImage(); // Open the file dialog
            }}
            variant={selectedShape === "image" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            colorPalette="blue"
          >
            <LuImage />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Drawing area"}>
          <IconButton
            aria-label="Drawing area"
            onClick={() => {
              setSelectedShape("drawing-area");
            }}
            variant={selectedShape === "drawing-area" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            colorPalette="blue"
          >
            <LuFrame />
          </IconButton>
        </Tooltip>
      </HStack>
    </div>
  );
};

export default Toolbar;
