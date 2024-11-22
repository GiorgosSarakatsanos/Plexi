import React from "react";
import { VStack, HStack, Heading } from "@chakra-ui/react";
import { useLayerContext } from "./useLayerContext";
import { shapeTypeNames } from "./ShapeTypeNames";
import { Layer } from "./LayerHelpers";

const LayerPanel: React.FC = () => {
  const { layers, selectedLayerIds, selectLayer } = useLayerContext();

  // Separate standalone layers and grouped layers
  const standaloneLayers = layers.filter((layer) => !layer.groupId); // No groupId -> standalone
  const groupedLayersMap: { [groupId: string]: Layer[] } = {};

  layers.forEach((layer) => {
    if (layer.groupId) {
      // Group layers by groupId
      if (!groupedLayersMap[layer.groupId]) {
        groupedLayersMap[layer.groupId] = [];
      }
      groupedLayersMap[layer.groupId].push(layer);
    }
  });

  return (
    <VStack align={"flex-start"} p={2}>
      {/* Standalone Layers Section */}
      <Heading size="sm" mb={2}>
        Standalone Layers
      </Heading>
      {standaloneLayers.map((layer) => {
        const shapeInfo = shapeTypeNames[layer.shapeType];
        const IconComponent = shapeInfo?.icon || shapeTypeNames["line"].icon;

        return (
          <HStack
            key={layer.id}
            onClick={(e) => {
              selectLayer(layer.id, e.ctrlKey || e.metaKey, e.shiftKey);
              console.log(`Standalone layer selected with ID: ${layer.id}`);
            }}
            className={`layer-item ${
              selectedLayerIds.includes(layer.id) ? "selected" : ""
            }`}
            style={{
              fontWeight: selectedLayerIds.includes(layer.id)
                ? "bold"
                : "normal",
            }}
          >
            <IconComponent />
            {shapeInfo?.name || "Unknown"}
          </HStack>
        );
      })}

      {/* Grouped Layers Section */}
      <Heading size="sm" mt={4} mb={2}>
        Grouped Layers
      </Heading>
      {Object.entries(groupedLayersMap).map(([groupId, groupLayers]) => (
        <VStack key={groupId} align="flex-start" p={2} border="1px solid #ccc">
          <Heading size="xs">Group: {groupId}</Heading>
          {groupLayers.map((layer) => {
            const shapeInfo = shapeTypeNames[layer.shapeType];
            const IconComponent =
              shapeInfo?.icon || shapeTypeNames["line"].icon;

            return (
              <HStack
                key={layer.id}
                onClick={(e) => {
                  selectLayer(layer.id, e.ctrlKey || e.metaKey, e.shiftKey);
                  console.log(
                    `Layer in group ${groupId} selected with ID: ${layer.id}`
                  );
                }}
                className={`layer-item ${
                  selectedLayerIds.includes(layer.id) ? "selected" : ""
                }`}
                style={{
                  fontWeight: selectedLayerIds.includes(layer.id)
                    ? "bold"
                    : "normal",
                }}
              >
                <IconComponent />
                {shapeInfo?.name || "Unknown"}
              </HStack>
            );
          })}
        </VStack>
      ))}
    </VStack>
  );
};

export default LayerPanel;
