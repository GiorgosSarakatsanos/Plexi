// src/components/Toolbar/Toolbar.tsx
import React from "react";
import {
  LuMousePointer2,
  LuSquare,
  LuCircle,
  LuMinus,
  LuType,
  LuHexagon,
} from "react-icons/lu";
import { HStack, IconButton } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";

interface ToolbarProps {
  selectedShape: string | null; // Add this
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedShape,
  setSelectedShape,
}) => {
  const handleShapeSelection = (shapeType: string) => {
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
      </HStack>
    </div>
  );
};

export default Toolbar;
