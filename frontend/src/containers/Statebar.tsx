// src/components/Toolbox.tsx
import React, { useState } from "react";
import Button from "../components/Button";
import { StatebarButtons } from "../data/ButtonMap";

const Toolbox: React.FC = () => {
  const [activeButton, setActiveButton] = useState<number | null>(null);

  const handleButtonClick = (id: number) => {
    setActiveButton(id);
  };

  return (
    <div>
      {StatebarButtons.map((button) => (
        <Button
          key={button.id}
          label={button.label}
          onClick={() => handleButtonClick(button.id)}
          isActive={activeButton === button.id}
          iconName={button.iconName}
        />
      ))}
    </div>
  );
};

export default Toolbox;
