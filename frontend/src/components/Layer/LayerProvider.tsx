import React, { createContext, useState, useEffect } from "react";
import { Layer } from "./LayerHelpers";
import { generateId } from "../../utils/idGenerator";
import { shapeTypeNames } from "./ShapeTypeNames";

interface LayerContextProps {
  layers: Layer[];
  groupedLayers: Layer[];
  standaloneLayers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>; // Expose setLayers
  addLayer: (shapeType: string, id?: string, groupId?: string) => void;
  toggleVisibility: (id: string) => void;
  selectLayer: (id: string, ctrlKey?: boolean, shiftKey?: boolean) => void;
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

  const groupedLayers = layers.filter((layer) => layer.isGrouped);
  const standaloneLayers = layers.filter((layer) => !layer.isGrouped);

  useEffect(() => {
    console.log("Layers updated:", layers);
  }, [layers]);

  const addLayer = (shapeType: string, id?: string, groupId?: string) => {
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
      isGrouped: !!groupId, // Mark as grouped if a groupId is provided
      groupId, // Store groupId if available
    };

    setLayers((prevLayers) => [...prevLayers, newLayer]);
    console.log(
      `Layer created with name: ${layerName}, ID: ${layerId}, Grouped: ${!!groupId}`
    );
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
        const lastSelectedId = prevSelected[prevSelected.length - 1];
        const lastSelectedIndex = layers.findIndex(
          (layer) => layer.id === lastSelectedId
        );
        const clickedIndex = layers.findIndex((layer) => layer.id === id);

        if (lastSelectedIndex >= 0 && clickedIndex >= 0) {
          const [start, end] = [
            Math.min(lastSelectedIndex, clickedIndex),
            Math.max(lastSelectedIndex, clickedIndex),
          ];
          const rangeIds = layers
            .slice(start, end + 1)
            .map((layer) => layer.id);
          return Array.from(new Set([...prevSelected, ...rangeIds]));
        }
      }

      if (ctrlKey) {
        return prevSelected.includes(id)
          ? prevSelected.filter((layerId) => layerId !== id)
          : [...prevSelected, id];
      }

      return [id];
    });
  };

  const deselectLayer = (id?: string) => {
    setSelectedLayerIds((prevSelected) =>
      id ? prevSelected.filter((layerId) => layerId !== id) : []
    );
  };

  return (
    <LayerContext.Provider
      value={{
        layers,
        groupedLayers,
        standaloneLayers,
        setLayers, // Include setLayers here
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
