import React from "react";
import { useLayerContext } from "./useLayerContext"; // Correct import
import LayerItem from "./LayerItem";
import "./LayerPanel.css";

const LayerPanel: React.FC = () => {
  const { layers, removeLayer } = useLayerContext();

  return (
    <div className="layer-panel">
      <h3>Layers</h3>
      {layers.length > 0 ? (
        layers.map((layer: { id: number; name: string; type: string }) => (
          <LayerItem
            key={layer.id}
            name={layer.name}
            id={layer.id}
            onRemove={removeLayer}
          />
        ))
      ) : (
        <p>No layers yet</p>
      )}
    </div>
  );
};

export default LayerPanel;
