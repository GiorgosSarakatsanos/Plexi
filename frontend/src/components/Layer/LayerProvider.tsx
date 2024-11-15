import React, { createContext, useState, useEffect } from "react";
import { Layer } from "./LayerHelpers";
import { generateId } from "../../utils/idGenerator";
import { shapeTypeNames } from "./ShapeTypeNames";

interface LayerContextProps {
  layers: Layer[];
  addLayer: (shapeType: string, id?: string) => void;
  toggleVisibility: (id: string) => void;
  selectLayer: (id: string, ctrlKey?: boolean, shiftKey?: boolean) => void; // Updated to accept shiftKey
  deselectLayer: (id?: string) => void;
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLayerIds: string[];
}

export const LayerContext = createContext<LayerContextProps | undefined>(
  undefined
);

const shapeTypeCounters: { [key: string]: number } = {};

export const LayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);

  useEffect(() => {
    console.log("Layers updated:", layers);
  }, [layers]);

  const addLayer = (shapeType: string, id?: string) => {
    if (!shapeTypeCounters[shapeType]) {
      shapeTypeCounters[shapeType] = 1;
    } else {
      shapeTypeCounters[shapeType] += 1;
    }

    const displayShapeType = shapeTypeNames[shapeType] || shapeType;
    const layerName = `${displayShapeType} ${shapeTypeCounters[shapeType]}`;
    const layerId = id || generateId();

    const newLayer: Layer = {
      id: layerId,
      name: layerName,
      isVisible: true,
      shapeType,
    };

    setLayers((prevLayers) => [...prevLayers, newLayer]);
    console.log(`Layer created with name: ${layerName} and ID: ${layerId}`);
  };

  const toggleVisibility = (id: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, isVisible: !layer.isVisible } : layer
      )
    );
  };

  const selectLayer = (id: string, ctrlKey = false, shiftKey = false) => {
    setSelectedLayerIds((prevSelected) => {
      if (shiftKey) {
        // Range selection logic
        const lastSelectedId = prevSelected[prevSelected.length - 1];
        const lastSelectedIndex = layers.findIndex(
          (layer) => layer.id === lastSelectedId
        );
        const clickedIndex = layers.findIndex((layer) => layer.id === id);

        if (lastSelectedIndex >= 0 && clickedIndex >= 0) {
          // Calculate range
          const [start, end] = [
            Math.min(lastSelectedIndex, clickedIndex),
            Math.max(lastSelectedIndex, clickedIndex),
          ];
          const rangeIds = layers
            .slice(start, end + 1)
            .map((layer) => layer.id);

          // Merge range into the current selection
          return Array.from(new Set([...prevSelected, ...rangeIds]));
        }
      }

      if (ctrlKey) {
        // Toggle selection when Ctrl key is held
        if (prevSelected.includes(id)) {
          return prevSelected.filter((layerId) => layerId !== id);
        } else {
          return [...prevSelected, id];
        }
      }

      // Default: Single selection
      return [id];
    });
  };

  const deselectLayer = (id?: string) => {
    setSelectedLayerIds((prevSelected) => {
      if (id) {
        return prevSelected.filter((layerId) => layerId !== id);
      } else {
        return [];
      }
    });
  };

  return (
    <LayerContext.Provider
      value={{
        layers,
        addLayer,
        toggleVisibility,
        selectLayer,
        deselectLayer,
        setSelectedLayerIds,
        selectedLayerIds,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};
