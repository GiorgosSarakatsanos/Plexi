// LayerContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { Layer } from "./LayerHelpers";
import { generateId } from "../../utils/idGenerator";

interface LayerContextProps {
  layers: Layer[];
  addLayer: (name: string, id?: string) => void; // Add optional id parameter
  toggleVisibility: (id: string) => void;
  selectLayer: (id: string) => void;
  selectedLayerId: string | null;
}

export const LayerContext = createContext<LayerContextProps | undefined>(
  undefined
);

export const LayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Layers updated:", layers);
  }, [layers]);

  const addLayer = (name: string, id?: string) => {
    const newLayer = {
      id: id || generateId(), // Use provided ID or generate a new one
      name,
      isVisible: true,
    };
    setLayers((prevLayers) => [...prevLayers, newLayer]);
    console.log(`Layer created with ID: ${newLayer.id}`); // Log layer creation ID
  };

  const toggleVisibility = (id: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, isVisible: !layer.isVisible } : layer
      )
    );
  };

  const selectLayer = (id: string) => {
    setSelectedLayerId(id);
    console.log("Selected layer ID:", id);
  };

  return (
    <LayerContext.Provider
      value={{
        layers,
        addLayer,
        toggleVisibility,
        selectLayer,
        selectedLayerId,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};
