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
import { useTransformer } from "../helpers/useTransformer";
import Konva from "konva";
import { LuFrame } from "react-icons/lu";

const LayerPanel: React.FC<{
  stageRef: React.RefObject<Konva.Stage>;
}> = ({ stageRef }) => {
  const { layers, selectedLayerIds, selectLayer, deselectLayer } =
    useLayerContext();

  const { applyTransformer, clearTransformer } = useTransformer();

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

  const handleLayerClick = (
    layer: Layer,
    ctrlKey: boolean = false,
    shiftKey: boolean = false
  ) => {
    if (selectedLayerIds.includes(layer.id)) {
      deselectLayer(layer.id);
      clearTransformer();
    } else {
      selectLayer(layer.id, ctrlKey, shiftKey);
      applyTransformer(stageRef, layer.id);
    }
  };

  return (
    <Stack p={0} align={"flex-start"}>
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
                <AccordionItemTrigger />
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
                        onClick={(e: React.MouseEvent) =>
                          handleLayerClick(
                            layer,
                            e.ctrlKey || e.metaKey,
                            e.shiftKey
                          )
                        }
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
            onClick={(e: React.MouseEvent) =>
              handleLayerClick(layer, e.ctrlKey || e.metaKey, e.shiftKey)
            }
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
            <Editable.Root
              defaultValue={shapeInfo?.name || "Unknown"}
              activationMode="dblclick"
              size="sm"
              fontSize="xs"
              w={"150px"}
              p={0}
              h={5}
              onSubmit={(event) => {
                const newValue = (event.target as HTMLInputElement).value;
                layer.name = newValue;
                console.log(`Updated layer name: ${newValue}`);
              }}
            >
              <Editable.Preview p={0} />
              <Editable.Input p={0} focusRing={"none"} />
            </Editable.Root>
          </HStack>
        );
      })}
    </Stack>
  );
};

export default LayerPanel;
