import React from "react";
import { useLayerContext } from "./useLayerContext";
import LayerItem from "./LayerItem";
import { Shape } from "../Shape/ShapeTypes";
import "./LayerPanel.css";

const LayerPanel: React.FC = () => {
  const { shapes, selectedShapeId, selectShapeById } = useLayerContext();
  console.log("Rendering LayerPanel: selectedShapeId =", selectedShapeId); // Log the selected shape ID

  return (
    <div className="layer-panel">
      <h3>Layers</h3>
      {shapes.map((shape: Shape) => (
        <LayerItem
          key={shape.id}
          shape={shape}
          isSelected={shape.id === selectedShapeId}
          onClick={() => {
            console.log("Layer item clicked: shape ID =", shape.id); // Log layer item click
            selectShapeById(shape.id);
          }}
        />
      ))}
    </div>
  );
};

export default LayerPanel;
