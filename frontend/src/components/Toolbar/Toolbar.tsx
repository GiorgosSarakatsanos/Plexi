// src/components/Toolbar/Toolbar.tsx
import React from "react";
import { IconButton } from "@chakra-ui/react";
import "boxicons/css/boxicons.min.css"; // Import Boxicons CSS

interface ToolbarProps {
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ setSelectedShape }) => {
  const handleShapeSelection = (shapeType: string) => {
    console.log("Selected shape:", shapeType); // Debugging
    setSelectedShape(shapeType);
  };

  // Use Chakra's CSS variables for size and color
  const iconStyle = {
    fontSize: "var(--chakra-sizes-7)", // Standard `3` size for icons
    color: "var(--chakra-colors-blue-500)", // Standard `blue.500` color for icons
  };

  return (
    <div className="toolbar-container">
      <IconButton
        aria-label="Select"
        onClick={() => handleShapeSelection("select")}
        variant="outline"
        rounded="full"
        size="xl"
        borderColor="var(--chakra-colors-blue-500)" // Button border color
      >
        <i className="bx bx-pointer" style={iconStyle} /> {/* Select icon */}
      </IconButton>
      <IconButton
        aria-label="Rectangle"
        onClick={() => handleShapeSelection("rect")}
        variant="outline"
        rounded="full"
        size="xl"
        borderColor="var(--chakra-colors-blue-500)"
      >
        <i className="bx bx-shape-square" style={iconStyle} />{" "}
        {/* Rectangle icon */}
      </IconButton>
      <IconButton
        aria-label="Ellipse"
        onClick={() => handleShapeSelection("ellipse")}
        variant="outline"
        rounded="full"
        size="xl"
        borderColor="var(--chakra-colors-blue-500)"
      >
        <i className="bx bx-shape-circle" style={iconStyle} />{" "}
        {/* Ellipse icon */}
      </IconButton>
      <IconButton
        aria-label="Triangle"
        onClick={() => handleShapeSelection("triangle")}
        variant="outline"
        rounded="full"
        size="xl"
        borderColor="var(--chakra-colors-blue-500)"
      >
        <i className="bx bx-shape-triangle" style={iconStyle} />{" "}
        {/* Triangle icon */}
      </IconButton>
      <IconButton
        aria-label="Line"
        onClick={() => handleShapeSelection("line")}
        variant="outline"
        rounded="full"
        size="xl"
        borderColor="var(--chakra-colors-blue-500)"
      >
        <i className="bx bx-minus" style={iconStyle} /> {/* Line icon */}
      </IconButton>
      <IconButton
        aria-label="Text"
        onClick={() => handleShapeSelection("text")}
        variant="outline"
        rounded="full"
        size="xl"
        borderColor="var(--chakra-colors-blue-500)"
      >
        <i className="bx bx-font" style={iconStyle} /> {/* Text icon */}
      </IconButton>
    </div>
  );
};

export default Toolbar;
