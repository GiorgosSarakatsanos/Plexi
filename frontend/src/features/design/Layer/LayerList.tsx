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
import { handleShapeSelection } from "../mouseActions/handleShapeSelection";
import { LuFrame } from "react-icons/lu";
import Konva from "konva";
import { applyTransformer } from "../helpers/applyTransformer";

const LayerPanel: React.FC<{
  stageRef: React.RefObject<Konva.Stage>;
  transformerRef: React.RefObject<Konva.Transformer>;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({
  stageRef,
  transformerRef,
  setSelectedShapeId,
  setSelectedLayerIds,
}) => {
  const { layers, selectedLayerIds, selectLayer, deselectLayer } =
    useLayerContext();

  const standaloneLayers = layers.filter(
    (layer) => !layer.isGrouped && !layer.isGroupArea
  );

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
                          console.log(`Clicked Layer ID: ${layer.id}`);
                          if (selectedLayerIds.includes(layer.id)) {
                            deselectLayer(layer.id);
                            applyTransformer(stageRef, transformerRef, null);
                          } else {
                            selectLayer(
                              layer.id,
                              e.ctrlKey || e.metaKey,
                              e.shiftKey
                            );
                            handleShapeSelection(
                              stageRef,
                              transformerRef,
                              setSelectedShapeId,
                              setSelectedLayerIds,
                              layer.id
                            );
                          }
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

      {standaloneLayers.map((layer) => {
        const shapeInfo = shapeTypeNames[layer.shapeType];
        const IconComponent = shapeInfo?.icon || shapeTypeNames["line"].icon;

        return (
          <HStack
            fontSize={"xs"}
            key={layer.id}
            onClick={() => {
              if (selectedLayerIds.includes(layer.id)) {
                deselectLayer(layer.id);
                applyTransformer(stageRef, transformerRef, null); // Remove transformer
              } else {
                selectLayer(layer.id, false, false);
                setSelectedShapeId(layer.id);
                setSelectedLayerIds([layer.id]);
                applyTransformer(stageRef, transformerRef, layer.id); // Apply transformer
              }
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
  );
};

export default LayerPanel;
