// src/components/Statebar/Statebar.tsx
import React from "react";
import Button from "../Button/Button";
import { StatebarButtons } from "../Button/ButtonMap";

const Statebar: React.FC<{
  setActiveButton: (id: string) => void;
  activeButton: string | null;
}> = ({ setActiveButton, activeButton }) => {
  return (
    <div className="statebar-panel">
      {StatebarButtons.map((button) => (
        <Button
          className="round"
          key={button.id}
          label={button.label}
          iconName={button.iconName}
          onClick={() => setActiveButton(button.id)}
          isActive={activeButton === button.id}
          tooltipPosition={button.tooltipPosition} // Pass tooltipPosition here
        />
      ))}
    </div>
  );
};

export default Statebar;
