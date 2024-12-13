import React, { createContext, useState, useEffect, useRef } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { Layer as LayerType } from "./LayerHelpers";
import { generateId } from "../../utils/idGenerator";
import { shapeTypeNames } from "./ShapeTypeNames";
import { useTransformer } from "../helpers/useTransformer";
import { useSelection } from "../helpers/useSelection";
import Konva from "konva";

interface LayerContextProps {
  layers: LayerType[];
  groupedLayers: LayerType[];
  standaloneLayers: LayerType[];
  setLayers: React.Dispatch<React.SetStateAction<LayerType[]>>;
  addLayer: (shapeType: string, shapeId: string, groupId?: string) => void;
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
  const [layers, setLayers] = useState<LayerType[]>([]);
  const groupedLayers = layers.filter((layer) => layer.isGrouped);
  const standaloneLayers = layers.filter((layer) => !layer.isGrouped);

  const { transformerRef, applyTransformer, clearTransformer } =
    useTransformer();
  const stageRef = useRef<Konva.Stage>(null);

  const {
    selectedIds: selectedLayerIds,
    selectItem: selectLayer,
    deselectItem: deselectLayer,
    setSelectedIds: setSelectedLayerIds,
  } = useSelection(layers);

  useEffect(() => {
    console.log("Layers updated:", layers);
  }, [layers]);

  useEffect(() => {
    if (selectedLayerIds.length > 0) {
      applyTransformer(stageRef, selectedLayerIds[selectedLayerIds.length - 1]);
    } else {
      clearTransformer();
    }
  }, [applyTransformer, clearTransformer, selectedLayerIds]);

  const addLayer = (
    shapeType: string,
    shapeId: string,
    groupId?: string
  ): string => {
    const layerId = generateId();
    console.log(`Generated layerId: ${layerId} for shapeId: ${shapeId}`);

    const displayShapeType = shapeTypeNames[shapeType] || shapeType;
    const layerName = `${displayShapeType} ${
      shapeTypeCounters[shapeType] || 1
    }`;

    const newLayer: LayerType = {
      id: layerId,
      name: layerName,
      isVisible: true,
      shapeType,
      groupId,
      isGrouped: !!groupId,
      isGroupArea: shapeType === "area",
    };

    setLayers((prevLayers) => [...prevLayers, newLayer]);
    console.log(
      `Layer created with name: ${layerName}, Layer ID: ${layerId}, Shape ID: ${shapeId}, Grouped: ${!!groupId}, Group ID: ${
        groupId ?? "None"
      }`
    );

    return layerId; // Return the generated layer ID
  };

  const toggleVisibility = (id: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === id ? { ...layer, isVisible: !layer.isVisible } : layer
      )
    );
  };

  return (
    <LayerContext.Provider
      value={{
        layers,
        groupedLayers,
        standaloneLayers,
        setLayers,
        addLayer,
        toggleVisibility,
        selectLayer,
        deselectLayer,
        setSelectedLayerIds,
        selectedLayerIds,
      }}
    >
      <Stage ref={stageRef}>
        <Layer>
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      {children}
    </LayerContext.Provider>
  );
};
