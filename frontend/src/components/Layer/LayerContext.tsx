import React, { createContext, useState, useEffect } from "react";
import { Layer } from "./LayerHelpers";
import { generateId } from "../../utils/idGenerator";
import { shapeTypeNames } from "./ShapeTypeNames"; // Import the external map

interface LayerContextProps {
  layers: Layer[];
  addLayer: (shapeType: string, id?: string) => void;
  toggleVisibility: (id: string) => void;
  selectLayer: (id: string) => void;
  deselectLayer: () => void; // Add deselectLayer to clear selection
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>; // Expose setSelectedLayerId for direct updates
  selectedLayerId: string | null;
}

export const LayerContext = createContext<LayerContextProps | undefined>(
  undefined
);

const shapeTypeCounters: { [key: string]: number } = {};

export const LayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

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

    const newLayer = {
      id: layerId,
      name: layerName,
      isVisible: true,
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

  const selectLayer = (id: string) => {
    if (id !== selectedLayerId) {
      setSelectedLayerId(id);
      console.log("Selected layer ID:", id);
    }
  };

  const deselectLayer = () => {
    setSelectedLayerId(null);
    console.log("Layer deselected");
  };

  return (
    <LayerContext.Provider
      value={{
        layers,
        addLayer,
        toggleVisibility,
        selectLayer,
        deselectLayer, // Provide deselectLayer to clear selection
        setSelectedLayerId, // Provide setSelectedLayerId for external updates
        selectedLayerId,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};
