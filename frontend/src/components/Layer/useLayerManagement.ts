// useLayerManagement.ts
import { useState } from "react";

export const useLayerManagement = () => {
  const [layers, setLayers] = useState<number[]>([]);

  const addLayer = () => {
    setLayers((prevLayers) => [...prevLayers, prevLayers.length + 1]);
  };

  return {
    layers,
    addLayer,
  };
};
