import React, { useState } from 'react';
import Icon from '../components/Icon';
import Dropdown from '../components/Dropdown';
import '../styles/Button.css';

interface DropdownItem {
  label: string;
  iconName: string;
}

interface ButtonProps {
  label: string;
  iconName?: string;
  dropdownItems?: DropdownItem[];
  isActive?: boolean;
  onClick: () => void; // Prop to manage button clicks from Toolbar
}

const Button: React.FC<ButtonProps> = ({ label, iconName, dropdownItems = [], isActive, onClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState<DropdownItem>({ label, iconName: iconName || '' });
  const [currentItems, setCurrentItems] = useState<DropdownItem[]>(dropdownItems);

  const handleMouseEnter = () => {
    if (dropdownItems.length > 0) setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleItemClick = (item: DropdownItem) => {
    // Swap active item with the clicked item
    setCurrentItems(prevItems => {
      // Move the current active item back to dropdown
      return [
        activeItem, // Add the current active item to the list
        ...prevItems.filter(i => i.label !== item.label) // Remove the selected item from the list
      ];
    });

    // Set the selected item as the active button label
    setActiveItem(item);
    onClick(); // Mark button as active
    setShowDropdown(false); // Close the dropdown
  };

  return (
    <div
      className="button-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`button ${isActive ? 'active' : ''}`}
        onClick={onClick}
      >
        <Icon name={activeItem.iconName} />
        {activeItem.label}
      </button>

      {currentItems.length > 0 && (
        <Dropdown
          items={currentItems} // Pass the updated dropdown items
          visible={showDropdown}
          onItemClick={handleItemClick} // Pass handleItemClick to handle dropdown selection
          activeItem={activeItem.label} // Pass activeItem to highlight active item
        />
      )}
    </div>
  );
};

export default Button;
