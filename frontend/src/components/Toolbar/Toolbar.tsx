import React, { useState } from "react";
import Button from "../Button/Button";
import { ToolbarButtons } from "../Button/ButtonMap";

interface ToolbarProps {
  setSelectedShape: React.Dispatch<React.SetStateAction<string | null>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ setSelectedShape }) => {
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);

  const handleShapeSelection = (shapeType: string | undefined, id: number) => {
    if (shapeType) {
      console.log("Selected shape:", shapeType); // Add this for debugging
      setSelectedShape(shapeType);
      setActiveButtonId(id); // Set the active button when clicked
    }
  };

  return (
    <div className="button-panel">
      {ToolbarButtons.map((button) => (
        <div key={button.id}>
          <Button
            label={button.label}
            onClick={() => handleShapeSelection(button.shapeType, button.id)}
            iconName={button.iconName}
            isActive={activeButtonId === button.id} // Check if button is active
          />
          {button.dropdownItems && button.dropdownItems.length > 0 && (
            <div className="dropdown">
              {button.dropdownItems.map((dropdownItem) => (
                <Button
                  key={dropdownItem.label}
                  label={dropdownItem.label}
                  onClick={() =>
                    handleShapeSelection(dropdownItem.shapeType, button.id)
                  }
                  iconName={dropdownItem.iconName}
                  isActive={activeButtonId === button.id} // Check if button is active
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
