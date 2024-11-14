// src/components/Toolbar/Toolbar.tsx
import React, { useState } from "react";
import {
  LuMousePointer2,
  LuSquare,
  LuCircle,
  LuTriangle,
  LuMinus,
  LuType,
} from "react-icons/lu";
import { HStack, IconButton } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";

interface ToolbarProps {
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ setSelectedShape }) => {
  const [activeShape, setActiveShape] = useState<string>("select"); // Default to "select" tool

  const handleShapeSelection = (shapeType: string) => {
    console.log("Selected shape:", shapeType); // Debugging
    setSelectedShape(shapeType);
    setActiveShape(shapeType); // Set the active shape for toggling
  };

  return (
    <div className="toolbar-container">
      <HStack background={"bg.panel"} rounded={"full"} p={"2"}>
        <Tooltip showArrow content={"Select"}>
          <IconButton
            aria-label="Select"
            onClick={() => handleShapeSelection("select")}
            variant={activeShape === "select" ? "solid" : "ghost"}
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
            variant={activeShape === "rect" ? "solid" : "ghost"}
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
            variant={activeShape === "ellipse" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            borderColor="var(--chakra-colors-blue-500)"
            colorPalette="blue"
          >
            <LuCircle />
          </IconButton>
        </Tooltip>
        <Tooltip showArrow content={"Triangle"}>
          <IconButton
            aria-label="Triangle"
            onClick={() => handleShapeSelection("triangle")}
            variant={activeShape === "triangle" ? "solid" : "ghost"}
            rounded="full"
            size="xs"
            borderColor="var(--chakra-colors-blue-500)"
            colorPalette="blue"
          >
            <LuTriangle />
          </IconButton>
        </Tooltip>

        <Tooltip showArrow content={"Line"}>
          <IconButton
            aria-label="Line"
            onClick={() => handleShapeSelection("line")}
            variant={activeShape === "line" ? "solid" : "ghost"}
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
            variant={activeShape === "text" ? "solid" : "ghost"}
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
