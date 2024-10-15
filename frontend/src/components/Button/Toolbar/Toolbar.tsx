import React, { useState } from "react";
import Button from "../Button";
import { ToolbarButtons } from "../ButtonMap";
import { handleToolbarButtonClick } from "../Toolbar/ToolbarActions";

interface ToolbarProps {
  setAddBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ setAddBox }) => {
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);

  return (
    <div className="button-panel">
      {ToolbarButtons.map((button) => (
        <Button
          key={button.id}
          label={button.label}
          iconName={button.iconName}
          dropdownItems={button.dropdownItems}
          isActive={activeButtonId === button.id}
          onClick={() =>
            handleToolbarButtonClick(button.id, setActiveButtonId, setAddBox)
          } // Use external logic
        />
      ))}
    </div>
  );
};

export default Toolbar;
