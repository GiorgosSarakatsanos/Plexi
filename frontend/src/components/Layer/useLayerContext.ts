import { useContext } from "react";
import { LayerContext } from "./LayerContext";

// Custom hook to use the LayerContext
export const useLayerContext = () => {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error("useLayerContext must be used within a LayerProvider");
  }
  return context;
};
