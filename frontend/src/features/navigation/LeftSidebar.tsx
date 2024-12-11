import React, { useState } from "react";
import { VStack, Tabs, Separator, IconButton, Box } from "@chakra-ui/react";
import {
  LuFolder,
  LuLayers,
  LuFrame,
  LuHelpCircle,
  LuChevronsLeftRight,
} from "react-icons/lu";

import LayerPanel from "../design/Layer/LayerList";
import AreaContent from "./AreaContent";
import TabTrigger from "./TabTrigger";
import Konva from "konva";

interface LeftSidebarProps {
  stageRef: React.RefObject<Konva.Stage>;
  transformerRef: React.RefObject<Konva.Transformer>;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSidebarWidth: () => void; // For <IconButton>
  expandSidebar: () => void; // For <Tabs.List>
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  stageRef,
  transformerRef,
  setSelectedShapeId,
  setSelectedLayerIds,
  toggleSidebarWidth,
  expandSidebar,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const barSize = "38px";

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
          alignItems="flex-start"
          display="flex"
          h="100vh"
          w={"full"}
        >
          {/* Tab List with barSize */}
          <Tabs.List
            py={2}
            gap={4}
            w={barSize}
            minW={barSize}
            maxW={barSize}
            flexShrink={0}
            onClick={expandSidebar} // Always expand the sidebar
          >
            <TabTrigger value="area" icon={<LuFrame />} label="" />
            <TabTrigger value="layers" icon={<LuLayers />} label="" />
            <TabTrigger value="projects" icon={<LuFolder />} label="" />
          </Tabs.List>

          <Separator orientation="vertical" h="100%" />

          {/* Content Section */}
          <Box flex="1" h="100%">
            <Tabs.Content p={0} value="area" w="full" px={2}>
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
          </Box>
        </Tabs.Root>
      </VStack>

      {/* Footer Section */}
      <VStack
        position={"absolute"}
        left={0}
        bottom={0}
        p={0}
        justify={"space-between"}
      >
        <Separator />
        <IconButton size={"xs"} variant={"plain"}>
          <LuHelpCircle />
        </IconButton>
        <IconButton size="xs" variant="plain" onClick={toggleSidebarWidth}>
          <LuChevronsLeftRight />
        </IconButton>
      </VStack>
    </VStack>
  );
};

export default LeftSidebar;
