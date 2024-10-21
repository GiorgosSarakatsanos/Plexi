import React from "react";
import "./ToggleButton.css"; // Import the styles

interface ToggleButtonProps {
  isToggled: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isToggled, onToggle }) => {
  return (
    <div
      className={`toggle-switch ${isToggled ? "toggled" : ""}`}
      onClick={onToggle}
    >
      <div className="toggle-circle"></div>
    </div>
  );
};

export default ToggleButton;
