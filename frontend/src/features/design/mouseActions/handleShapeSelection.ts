import Konva from "konva";
import { applyTransformer } from "../helpers/applyTransformer";


export const handleShapeSelection = (
  stageRef: React.RefObject<Konva.Stage>,
  transformerRef: React.RefObject<Konva.Transformer>,
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>,
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>,
  layerId: string
) => {
  setSelectedShapeId(layerId); // Update selected shape ID
  setSelectedLayerIds([layerId]); // Sync selected layers
  applyTransformer(stageRef, transformerRef, layerId); // Apply the transformer
  console.log("Transformer applied to layer ID:", layerId);
};
