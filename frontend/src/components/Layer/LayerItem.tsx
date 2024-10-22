import React from "react";

interface LayerItemProps {
  name: string;
  id: number;
  onRemove: (id: number) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({ name, id, onRemove }) => {
  return (
    <div className="layer-item">
      <span>{name}</span>
      <button onClick={() => onRemove(id)}>x</button>
    </div>
  );
};

export default LayerItem;
