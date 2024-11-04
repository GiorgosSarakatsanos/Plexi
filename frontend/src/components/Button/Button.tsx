import React, { useState } from "react";
import Icon from "../Icon/Icon";
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
  iconName,
  isActive,
  tooltipPosition = "top",
  onClick,
  className,
  iconSize = "normal", // Default to normal if not provided
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
      {iconName && <Icon name={iconName} size={iconSize} />}
      <Tooltip text={label} visible={showTooltip} position={tooltipPosition} />
    </button>
  );
};

export default Button;
