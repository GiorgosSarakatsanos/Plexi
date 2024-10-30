import React from "react";
import Button from "../Button/Button";
import { StatebarButtons } from "../Button/ButtonMap";

const Statebar: React.FC<{
  setActiveButton: (id: string) => void;
  activeButton: string | null;
}> = ({ setActiveButton, activeButton }) => {
  return (
    <div>
      {StatebarButtons.map((button) => (
        <Button
          key={button.id}
          label={button.label}
          onClick={() => setActiveButton(button.id)}
          isActive={activeButton === button.id}
          iconName={button.iconName}
        />
      ))}
    </div>
  );
};

export default Statebar;
