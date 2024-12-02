import React from "react";
import { HStack, Stack, Editable } from "@chakra-ui/react";
import { useLayerContext } from "./useLayerContext";
import { shapeTypeNames } from "./ShapeTypeNames";
import { Layer } from "./LayerHelpers";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../../../ui/accordion";

import { LuFrame } from "react-icons/lu";

const LayerPanel: React.FC = () => {
  const { layers, selectedLayerIds, selectLayer } = useLayerContext();

  // Separate standalone layers
  const standaloneLayers = layers.filter(
    (layer) => !layer.isGrouped && !layer.isGroupArea
  );

  // Group layers by groupId
  const groupedLayersMap: { [groupId: string]: Layer[] } = {};
  layers.forEach((layer) => {
    if (layer.groupId && !layer.isGroupArea) {
      if (!groupedLayersMap[layer.groupId]) {
        groupedLayersMap[layer.groupId] = [];
      }
      groupedLayersMap[layer.groupId].push(layer);
    }
  });

  return (
    <Stack align={"flex-start"}>
      {/* Grouped Layers Section as Accordion */}
      <Stack width="full">
        <AccordionRoot collapsible variant={"plain"}>
          {Object.entries(groupedLayersMap).map(([groupId, groupLayers]) => (
            <AccordionItem key={groupId} value={groupId}>
              <HStack>
                <HStack>
                  <LuFrame />
                  <Editable.Root
                    defaultValue={`Frame ${
                      Object.keys(groupedLayersMap).indexOf(groupId) + 1
                    }`}
                    activationMode="dblclick"
                    size={"sm"}
                    fontSize={"xs"}
                  >
                    <Editable.Input width={"150px"} />
                    <Editable.Preview width={"150px"} />
                  </Editable.Root>
                </HStack>
                <AccordionItemTrigger></AccordionItemTrigger>
              </HStack>
              <AccordionItemContent fontSize="xs">
                <Stack align="flex-start">
                  {groupLayers.map((layer) => {
                    const shapeInfo = shapeTypeNames[layer.shapeType];
                    const IconComponent =
                      shapeInfo?.icon || shapeTypeNames["line"].icon;

                    return (
                      <HStack
                        pl={4}
                        key={layer.id}
                        onClick={(e) => {
                          selectLayer(
                            layer.id,
                            e.ctrlKey || e.metaKey,
                            e.shiftKey
                          );
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
                </Stack>
              </AccordionItemContent>
            </AccordionItem>
          ))}
        </AccordionRoot>
      </Stack>

      {/* Standalone Layers Section */}
      {standaloneLayers.map((layer) => {
        const shapeInfo = shapeTypeNames[layer.shapeType];
        const IconComponent = shapeInfo?.icon || shapeTypeNames["line"].icon;

        return (
          <HStack
            fontSize={"xs"}
            key={layer.id}
            onClick={(e) => {
              selectLayer(layer.id, e.ctrlKey || e.metaKey, e.shiftKey);
              console.log(`Standalone layer selected with ID: ${layer.id}`);
            }}
            className={`layer-item ${
              selectedLayerIds.includes(layer.id) ? "selected" : ""
            }`}
            style={{
              fontWeight: selectedLayerIds.includes(layer.id) ? "bold" : "xs",
            }}
          >
            <IconComponent />
            {shapeInfo?.name || "Unknown"}
          </HStack>
        );
      })}
    </Stack>
  );
};

export default LayerPanel;
