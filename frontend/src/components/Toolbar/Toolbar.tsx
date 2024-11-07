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
import { Flex, IconButton } from "@chakra-ui/react";

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
      <Flex direction="column" gap="2">
        <IconButton
          aria-label="Select"
          onClick={() => handleShapeSelection("select")}
          variant={activeShape === "select" ? "solid" : "ghost"}
          rounded="full"
          size="lg"
          colorPalette="blue"
        >
          <LuMousePointer2 />
        </IconButton>

        <IconButton
          aria-label="Rectangle"
          onClick={() => handleShapeSelection("rect")}
          variant={activeShape === "rect" ? "solid" : "ghost"}
          rounded="full"
          size="lg"
          borderColor="var(--chakra-colors-blue-500)"
          colorPalette="blue"
        >
          <LuSquare />
        </IconButton>

        <IconButton
          aria-label="Ellipse"
          onClick={() => handleShapeSelection("ellipse")}
          variant={activeShape === "ellipse" ? "solid" : "ghost"}
          rounded="full"
          size="lg"
          borderColor="var(--chakra-colors-blue-500)"
          colorPalette="blue"
        >
          <LuCircle />
        </IconButton>

        <IconButton
          aria-label="Triangle"
          onClick={() => handleShapeSelection("triangle")}
          variant={activeShape === "triangle" ? "solid" : "ghost"}
          rounded="full"
          size="lg"
          borderColor="var(--chakra-colors-blue-500)"
          colorPalette="blue"
        >
          <LuTriangle />
        </IconButton>

        <IconButton
          aria-label="Line"
          onClick={() => handleShapeSelection("line")}
          variant={activeShape === "line" ? "solid" : "ghost"}
          rounded="full"
          size="lg"
          borderColor="var(--chakra-colors-blue-500)"
          colorPalette="blue"
        >
          <LuMinus />
        </IconButton>

        <IconButton
          aria-label="Text"
          onClick={() => handleShapeSelection("text")}
          variant={activeShape === "text" ? "solid" : "ghost"}
          rounded="full"
          size="lg"
          borderColor="var(--chakra-colors-blue-500)"
          colorPalette="blue"
        >
          <LuType />
        </IconButton>
      </Flex>
    </div>
  );
};

export default Toolbar;
