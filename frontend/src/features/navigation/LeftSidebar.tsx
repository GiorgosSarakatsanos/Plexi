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

const LeftSidebar: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <VStack gap={0} w="100%" h={"100%"} justify={"space-between"}>
      {/* Tabs Section */}
      <VStack gap={0} w="100%" align={"flex-start"}>
        <Tabs.Root p={0} defaultValue="area" size="sm" variant="plain" w="100%">
          <Tabs.List
            p={0}
            height={"45px"}
            display="flex"
            alignItems="center"
            borderRadius={0}
            bg={"bg.subtle"}
          >
            <TabTrigger value="area" icon={<LuFrame />} label="Area" />
            <TabTrigger value="layers" icon={<LuLayers />} label="Layers" />
            <TabTrigger value="projects" icon={<LuFolder />} label="Files" />
          </Tabs.List>

          {/* Tab Content */}
          <Tabs.Content p={0} value="area">
            <AreaContent
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </Tabs.Content>
          <Tabs.Content value="layers" px={3}>
            <LayerPanel />
          </Tabs.Content>
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
