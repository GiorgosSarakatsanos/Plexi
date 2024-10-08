import React from 'react';
import Icon from '../components/Icon';
import '../styles/Input.css';

interface DropdownItem {
  label: string;
  iconName: string;
}

interface DropdownProps {
  items: DropdownItem[];
  visible: boolean;
  onItemClick: (item: DropdownItem) => void;
  activeItem: string; // Pass the active item label to highlight
}

const Dropdown: React.FC<DropdownProps> = ({ items, visible, onItemClick, activeItem }) => {
  if (!visible) return null;

  return (
    <div className="dropdown">
      {items.map((item, index) => (
        <div
          key={index}
          className={`dropdown-item ${item.label === activeItem ? 'active' : ''}`} // Highlight active item
          onClick={() => onItemClick(item)} // Handle item selection
        >
          <Icon name={item.iconName} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
