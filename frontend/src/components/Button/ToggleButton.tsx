import React, { useState } from "react";
import "./ToggleButton.css"; // Import the styles

const ToggleButton: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  return (
    <div
      className={`toggle-switch ${isToggled ? "toggled" : ""}`}
      onClick={handleToggle}
    >
      <div className="toggle-circle"></div>
    </div>
  );
};

export default ToggleButton;
