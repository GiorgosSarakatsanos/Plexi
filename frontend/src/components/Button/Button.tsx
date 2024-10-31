import React, { useState } from "react";
import Icon from "../Icon/Icon";
import Dropdown from "../Dropdown/Dropdown";
import Tooltip from "../Tooltip/Tooltip";
import "./ButtonMap";

interface DropdownItem {
  label: string;
  iconName: string;
}

interface ButtonProps {
  label: string;
  iconName?: string;
  dropdownItems?: DropdownItem[];
  isActive?: boolean;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  iconName,
  dropdownItems = [],
  isActive,
  tooltipPosition = "top", // Default position if not provided
  onClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeItem, setActiveItem] = useState<DropdownItem>({
    label,
    iconName: iconName || "",
  });
  const [currentItems, setCurrentItems] =
    useState<DropdownItem[]>(dropdownItems);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    if (dropdownItems.length > 0) setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setShowDropdown(false);
  };

  const handleItemClick = (item: DropdownItem) => {
    setCurrentItems((prevItems) => [
      activeItem,
      ...prevItems.filter((i) => i.label !== item.label),
    ]);
    setActiveItem(item);
    onClick();
    setShowDropdown(false);
  };

  return (
    <div
      className="button-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }}
    >
      <button
        className={`button ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        <Icon name={activeItem.iconName} />
      </button>

      {/* Pass tooltipPosition to Tooltip */}
      <Tooltip text={label} visible={showTooltip} position={tooltipPosition} />

      {currentItems.length > 0 && (
        <Dropdown
          items={currentItems}
          visible={showDropdown}
          onItemClick={handleItemClick}
          activeItem={activeItem.label}
        />
      )}
    </div>
  );
};

export default Button;
