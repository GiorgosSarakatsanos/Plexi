import React, { createContext, useState, ReactNode } from "react";

interface Layer {
  id: number;
  name: string;
  type: string;
}

interface LayerContextProps {
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  removeLayer: (id: number) => void;
  selectedLayer: Layer | null;
  setSelectedLayer: (layer: Layer | null) => void;
}

const LayerContext = createContext<LayerContextProps | undefined>(undefined);

interface LayerProviderProps {
  children: ReactNode;
}

export const LayerProvider: React.FC<LayerProviderProps> = ({ children }) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [shapeCounts, setShapeCounts] = useState<{ [key: string]: number }>({});
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

  const addLayer = (layer: Layer) => {
    const shapeCount = shapeCounts[layer.type] || 0;
    const newCount = shapeCount + 1;
    const layerName = `${capitalizeFirstLetter(layer.type)} ${newCount}`;

    setShapeCounts((prev) => ({
      ...prev,
      [layer.type]: newCount,
    }));

    setLayers((prev) => [...prev, { ...layer, name: layerName }]);
  };

  const removeLayer = (id: number) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    if (selectedLayer && selectedLayer.id === id) {
      setSelectedLayer(null); // Deselect if the removed layer was selected
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <LayerContext.Provider
      value={{ layers, addLayer, removeLayer, selectedLayer, setSelectedLayer }}
    >
      {children}
    </LayerContext.Provider>
  );
};

export { LayerContext };
