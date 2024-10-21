//Toolbar.tsx

import React from "react";
import Button from "../Button/Button";
import { ToolbarButtons } from "../Button/ButtonMap";
import { shapeDataMap } from "../Shapes/ShapeDataMap";

interface ToolbarProps {
  setSelectedShape: React.Dispatch<
    React.SetStateAction<keyof typeof shapeDataMap | null>
  >;
}

const Toolbar: React.FC<ToolbarProps> = ({ setSelectedShape }) => {
  const handleShapeSelection = (shapeType: string | undefined) => {
    // Ensure shapeType is a valid string and exists in shapeDataMap
    if (shapeType && shapeType in shapeDataMap) {
      setSelectedShape(shapeType as keyof typeof shapeDataMap);
    }
  };

  return (
    <div className="button-panel">
      {ToolbarButtons.map((button) => (
        <div key={button.id}>
          <Button
            label={button.label}
            onClick={() => handleShapeSelection(button.shapeType)} // Ensure shapeType is passed correctly
            iconName={button.iconName} // Pass iconName prop
          />
          {button.dropdownItems && button.dropdownItems.length > 0 && (
            <div className="dropdown">
              {button.dropdownItems.map((dropdownItem) => (
                <Button
                  key={dropdownItem.label}
                  label={dropdownItem.label}
                  onClick={() => handleShapeSelection(dropdownItem.shapeType)}
                  iconName={dropdownItem.iconName} // Pass iconName for dropdown
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
