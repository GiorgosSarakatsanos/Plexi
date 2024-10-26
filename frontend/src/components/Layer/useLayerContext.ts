// src/components/Layer/useLayerContext.ts
import { useContext } from "react";
import { LayerContext } from "./LayerContext";

export const useLayerContext = () => {
  const context = useContext(LayerContext);
  if (!context)
    throw new Error("useLayerContext must be used within a LayerProvider");
  return context;
};
