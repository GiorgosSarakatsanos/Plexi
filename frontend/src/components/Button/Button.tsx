import React, { useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import "./ButtonMap";

interface ButtonProps {
  label: string;
  iconName?: string;
  isActive?: boolean;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  onClick: () => void;
  className?: string;
  iconSize?: "normal" | "small"; // Add iconSize prop
}

const Button: React.FC<ButtonProps> = ({
  label,
  isActive,
  tooltipPosition = "top",
  onClick,
  className,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <button
      className={`button ${isActive ? "active" : ""} ${className || ""}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }}
    >
      <Tooltip text={label} visible={showTooltip} position={tooltipPosition} />
    </button>
  );
};

export default Button;
