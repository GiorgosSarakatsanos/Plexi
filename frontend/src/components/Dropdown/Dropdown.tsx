import React from "react";
import Icon from "../Icon/Icon";
import "../Button/ButtonStyle.css";

interface DropdownItem {
  label: string;
  iconName: string;
}

interface DropdownProps {
  items: DropdownItem[];
  visible: boolean;
  onItemClick: (item: DropdownItem) => void;
  activeItem: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  visible,
  onItemClick,
  activeItem,
}) => {
  const collapsedItem =
    items.find((item) => item.label === activeItem) || items[0];

  return (
    <div className="input">
      {/* Display the collapsed item (active or first) */}
      <div className="collapsed-item">
        <Icon name={collapsedItem.iconName} />
      </div>

      {/* Display dropdown when hovered */}
      {visible && (
        <div className="dropdown">
          {items.map((item, index) => (
            <div
              key={index}
              className={`list-item ${
                item.label === activeItem ? "active" : ""
              }`}
              onClick={() => onItemClick(item)}
            >
              <Icon name={item.iconName} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
