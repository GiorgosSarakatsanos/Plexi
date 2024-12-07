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
import AreaContent from "./AreaContent"; // Import AreaContent
import TabTrigger from "./TabTrigger"; // Import TabTrigger
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
          display="flex" // Use flexbox
          h="100vh" // Ensure full height
          w={"full"}
        >
          {/* Tab List with barSize */}
          <Tabs.List
            py={2}
            gap={4}
            w={barSize}
            minW={barSize} // Prevent shrinking
            maxW={barSize} // Prevent expansion
            flexShrink={0} // Ensure it doesn't shrink in flex layout
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
        p={1}
        justify={"space-between"}
      >
        <Separator />
        <IconButton size={"xs"} variant={"plain"}>
          <LuHelpCircle />
        </IconButton>
        <IconButton size={"xs"} variant={"plain"}>
          <LuChevronsLeftRight />
        </IconButton>
      </VStack>
    </VStack>
  );
};

export default LeftSidebar;
