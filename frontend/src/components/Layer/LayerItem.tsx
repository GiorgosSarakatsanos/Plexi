import React from "react";

interface LayerItemProps {
  name: string;
  id: number;
  onRemove: (id: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
}

const LayerItem: React.FC<LayerItemProps> = ({
  name,
  id,
  onRemove,
  onSelect,
  isSelected,
}) => {
  return (
    <div
      className={`layer-item ${isSelected ? "active" : ""}`} // Add 'active' class if selected
      onClick={() => onSelect(id)} // Call onSelect when clicked
    >
      <span>{name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
      >
        x
      </button>
    </div>
  );
};

export default LayerItem;
