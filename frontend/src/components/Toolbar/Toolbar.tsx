// src/components/Toolbar/Toolbar.tsx
import React, { useState } from "react";
import Button from "../Button/Button";
import { ToolbarButtons } from "../Button/ButtonMap";

interface ToolbarProps {
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ setSelectedShape }) => {
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);

  const handleShapeSelection = (shapeType: string | undefined, id: string) => {
    if (shapeType) {
      console.log("Selected shape:", shapeType); // Debugging
      setSelectedShape(shapeType);
      setActiveButtonId(id); // Set the active button when clicked
    }
  };

  return (
    <div className="button-panel">
      {ToolbarButtons.map((button) => (
        <Button
          className="round"
          key={button.id}
          label={button.label}
          onClick={() => handleShapeSelection(button.shapeType, button.id)}
          iconName={button.iconName}
          isActive={activeButtonId === button.id}
          tooltipPosition={button.tooltipPosition}
          iconSize="normal" // Ensure normal-sized icon
        />
      ))}
    </div>
  );
};

export default Toolbar;
