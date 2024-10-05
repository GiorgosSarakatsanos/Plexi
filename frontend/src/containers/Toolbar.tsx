// src/components/Toolbar.tsx
import React, { useState } from 'react';
import Button from '../components/Button';
import { ToolbarButtons } from '../data/ButtonMap';

const Toolbar: React.FC = () => {
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);

  // Function to handle button activation
  const handleButtonClick = (id: number) => {
    setActiveButtonId(id); // Set the clicked button as active
  };

  return (
    <div className="button-panel">
      {ToolbarButtons.map((button) => (
        <Button
          key={button.id}
          label={button.label}
          iconName={button.iconName}
          dropdownItems={button.dropdownItems}
          isActive={activeButtonId === button.id}
          onClick={() => handleButtonClick(button.id)} // Pass onClick to activate button
        />
      ))}
    </div>
  );
};

export default Toolbar;
