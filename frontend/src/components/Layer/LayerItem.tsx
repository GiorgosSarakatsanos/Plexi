import React from "react";
import { Shape } from "../Shape/ShapeTypes";
import "./LayerPanel.css";

interface LayerItemProps {
  shape: Shape;
  isSelected: boolean;
  onClick: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  shape,
  isSelected,
  onClick,
}) => {
  console.log(`LayerItem: ${shape.id} isSelected =`, isSelected); // Log selection state for each LayerItem

  return (
    <div
      className={`layer-item ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span>{shape.type}</span> {/* Display the shape type or name */}
    </div>
  );
};

export default LayerItem;
