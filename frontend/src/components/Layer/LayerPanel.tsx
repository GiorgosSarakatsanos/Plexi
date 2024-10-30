// LayerPanel.tsx
import React from "react";
import { useLayerContext } from "./useLayerContext";
import "./layerStyle.css";

const LayerPanel: React.FC = () => {
  const { layers, selectedLayerId, selectLayer } = useLayerContext();

  return (
    <div>
      {layers.map((layer) => (
        <div
          key={layer.id}
          onClick={() => {
            selectLayer(layer.id); // Selects layer
            console.log(`Layer selected with ID: ${layer.id}`); // Log layer selection
          }}
          className={`layer-item ${
            layer.id === selectedLayerId ? "selected" : ""
          }`}
        >
          {layer.name}
        </div>
      ))}
    </div>
  );
};

export default LayerPanel;
