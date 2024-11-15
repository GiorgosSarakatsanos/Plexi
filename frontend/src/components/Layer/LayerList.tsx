import React from "react";
import { List, VStack, HStack } from "@chakra-ui/react";
import { useLayerContext } from "./useLayerContext";
import { shapeTypeNames } from "./ShapeTypeNames";

const LayerPanel: React.FC = () => {
  const { layers, selectedLayerIds, selectLayer } = useLayerContext();

  return (
    <VStack align={"flex-start"} p={2}>
      {layers.map((layer) => {
        const shapeInfo = shapeTypeNames[layer.shapeType];
        const IconComponent = shapeInfo?.icon || shapeTypeNames["line"].icon;

        return (
          <List.Root key={layer.id} variant={"plain"}>
            <List.Item
              fontSize={"xs"}
              onClick={(e) => {
                selectLayer(layer.id, e.ctrlKey || e.metaKey, e.shiftKey); // Pass Shift key status
                console.log(`Layer selected with ID: ${layer.id}`);
              }}
              className={`layer-item ${
                selectedLayerIds.includes(layer.id) ? "selected" : ""
              }`}
              style={{
                fontWeight: selectedLayerIds.includes(layer.id)
                  ? "bold"
                  : "normal", // Bold for selected layers
              }}
            >
              <HStack>
                <IconComponent />
                {shapeInfo?.name || "Unknown"}
              </HStack>
            </List.Item>
          </List.Root>
        );
      })}
    </VStack>
  );
};

export default LayerPanel;
