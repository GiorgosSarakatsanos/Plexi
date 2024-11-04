import React from "react";
import { useLayerContext } from "./useLayerContext";
import "./layerStyle.css";

interface LayerItemProps {
  layer: {
    id: string;
    name: string;
    isVisible: boolean;
  };
}

const LayerItem: React.FC<LayerItemProps> = ({ layer }) => {
  const { toggleVisibility, selectLayer, selectedLayerId } = useLayerContext();
  const isSelected = selectedLayerId === layer.id;

  return (
    <div className={`layer-item ${isSelected ? "selected" : ""}`}>
      <span onClick={() => selectLayer(layer.id)}>{layer.name}</span>
      <button onClick={() => toggleVisibility(layer.id)}>
        {layer.isVisible ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default LayerItem;
