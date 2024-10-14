import React, { useState } from "react";
import Icon from "../Icon/Icon";
import Dropdown from "../Dropdown/Dropdown";
import "../../styles/Button.css";

interface DropdownItem {
  label: string;
  iconName: string;
}

interface ButtonProps {
  label: string;
  iconName?: string;
  dropdownItems?: DropdownItem[];
  isActive?: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  iconName,
  dropdownItems = [],
  isActive,
  onClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState<DropdownItem>({
    label,
    iconName: iconName || "",
  });
  const [currentItems, setCurrentItems] =
    useState<DropdownItem[]>(dropdownItems);

  const handleMouseEnter = () => {
    if (dropdownItems.length > 0) setShowDropdown(true);
  };

  const handleMouseLeave = () => {
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
    >
      <button
        className={`button ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        
        <Icon name={activeItem.iconName} />
        <span className="button-text">{activeItem.label}</span>{" "}

      </button>

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
