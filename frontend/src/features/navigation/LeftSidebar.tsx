import React, { useState } from "react";
import { VStack, HStack, Tabs, Box } from "@chakra-ui/react";
import {
  LuFolder,
  LuLayers,
  LuFrame,
  LuChevronsUpDown,
  LuHelpCircle,
} from "react-icons/lu";

import LayerPanel from "../design/Layer/LayerList";
import AreaContent from "./AreaContent"; // Import AreaContent
import TabTrigger from "./TabTrigger"; // Import TabTrigger
import FooterButton from "./FooterButton"; // Import FooterButton
import Konva from "konva";

interface LeftSidebarProps {
  stageRef: React.RefObject<Konva.Stage>;
  transformerRef: React.RefObject<Konva.Transformer>;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  stageRef,
  transformerRef,
  setSelectedShapeId,
  setSelectedLayerIds,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <VStack gap={0} h={"100%"} justify={"space-between"} w={"full"}>
      {/* Tabs Section */}
      <VStack gap={0} w="100%" alignItems={"flex-start"}>
        <Tabs.Root
          p={0}
          defaultValue="area"
          size="sm"
          variant="plain"
          orientation="vertical"
          alignItems={"flex-start"}
          w={"full"}
        >
          <Tabs.List py={2} gap={4} h={"45px"} borderRadius={0}>
            <TabTrigger value="area" icon={<LuFrame />} label="" />
            <TabTrigger value="layers" icon={<LuLayers />} label="" />
            <TabTrigger value="projects" icon={<LuFolder />} label="" />
          </Tabs.List>

          {/* Tab Content */}
          <Tabs.Content p={0} value="area" w={"full"} px={2}>
            <AreaContent
              stageRef={stageRef}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </Tabs.Content>
          <Tabs.Content value="layers" px={0}>
            <LayerPanel
              stageRef={stageRef}
              transformerRef={transformerRef}
              setSelectedShapeId={setSelectedShapeId}
              setSelectedLayerIds={setSelectedLayerIds}
            />
          </Tabs.Content>
          <Tabs.Content value="projects">Manage your projects</Tabs.Content>
          <Tabs.Content value="projects">Manage your projects</Tabs.Content>
        </Tabs.Root>
      </VStack>

      {/* Footer Section */}
      <HStack
        w="100%"
        h={"45px"}
        px={0}
        justify={"space-between"}
        borderTop={"1px solid"}
        borderColor={"bg.emphasized"}
      >
        <FooterButton
          icon={<LuHelpCircle />}
          popoverContent={<Box>Some content</Box>}
        />
        <FooterButton
          icon={<LuChevronsUpDown />}
          tooltip="Collapse this panel to make space for design"
        />
      </HStack>
    </VStack>
  );
};

export default LeftSidebar;
