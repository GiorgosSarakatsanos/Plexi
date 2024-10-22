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
}

const LayerContext = createContext<LayerContextProps | undefined>(undefined);

interface LayerProviderProps {
  children: ReactNode;
}

export const LayerProvider: React.FC<LayerProviderProps> = ({ children }) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [shapeCounts, setShapeCounts] = useState<{ [key: string]: number }>({});

  const addLayer = (layer: Layer) => {
    // Track the count for each shape type
    const shapeCount = shapeCounts[layer.type] || 0;
    const newCount = shapeCount + 1;
    const layerName = `${capitalizeFirstLetter(layer.type)} ${newCount}`;

    // Update the count for the shape type
    setShapeCounts((prev) => ({
      ...prev,
      [layer.type]: newCount,
    }));

    // Add the layer with the generated name
    setLayers((prev) => [...prev, { ...layer, name: layerName }]);
  };

  const removeLayer = (id: number) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
  };

  // Helper function to capitalize the first letter of the shape type
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <LayerContext.Provider value={{ layers, addLayer, removeLayer }}>
      {children}
    </LayerContext.Provider>
  );
};

// Export LayerContext so it can be used in the hook
export { LayerContext };
