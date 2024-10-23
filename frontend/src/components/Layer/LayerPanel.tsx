import React, { useContext } from "react";
import LayerItem from "./LayerItem";
import { LayerContext } from "./LayerContext";

import "./layerPanel.css";

const LayerPanel: React.FC = () => {
  const layerContext = useContext(LayerContext);

  // Ensure layerContext exists
  if (!layerContext) {
    return <div>Error: Layer context not found</div>;
  }

  const { layers, removeLayer, selectedLayer, setSelectedLayer } = layerContext;

  const handleSelect = (id: number) => {
    const layer = layers.find((layer) => layer.id === id);
    if (layer) {
      console.log("Selecting layer: ", layer); // Debugging
      setSelectedLayer(layer); // Update selected layer
    }
  };

  return (
    <div className="layer-panel">
      {layers.map((layer) => (
        <LayerItem
          key={layer.id}
          id={layer.id}
          name={layer.name}
          onRemove={removeLayer}
          onSelect={handleSelect}
          isSelected={selectedLayer?.id === layer.id}
        />
      ))}
    </div>
  );
};

export default LayerPanel;
