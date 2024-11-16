import React, { useState, useEffect } from "react";
import { VStack, Text, Box, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuLayers, LuLayout, LuPalette } from "react-icons/lu";
import ColorPickerButton from "../ColorPickerButton/ColorPickerButton";
import CollapsibleSection from "./CollapsibleSection";
import LayerPanel from "../Layer/LayerList";

interface SidebarProps {
  handleColorChange: (color: string) => void;
  handleOpacityChange: (opacity: number) => void;
  toggleSidebarWidth: () => void;
  expandSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleColorChange,
  handleOpacityChange,
  toggleSidebarWidth,
  expandSidebar, // Expand-only function
  isSidebarCollapsed,
}) => {
  // State for each section's open status
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  // Close all sections when the sidebar is collapsed
  useEffect(() => {
    if (isSidebarCollapsed) {
      setIsColorOpen(false);
      setIsGridOpen(false);
      setIsLayersOpen(false);
    }
  }, [isSidebarCollapsed]);

  return (
    <VStack align="stretch" justify={"space-between"} height="100%">
      <VStack gap={2}>
        <CollapsibleSection
          icon={<LuPalette />}
          title="Color"
          defaultOpen={isColorOpen}
          expandSidebar={expandSidebar} // Use expandSidebar here
          isSidebarCollapsed={isSidebarCollapsed}
          onToggle={() => setIsColorOpen((prev) => !prev)} // Toggle this section
        >
          <ColorPickerButton
            onChangeColor={handleColorChange}
            onOpacityChange={handleOpacityChange}
          />
        </CollapsibleSection>
        <CollapsibleSection
          icon={<LuLayout />}
          title="Grid"
          defaultOpen={isGridOpen}
          expandSidebar={expandSidebar} // Use expandSidebar here
          isSidebarCollapsed={isSidebarCollapsed}
          onToggle={() => setIsGridOpen((prev) => !prev)} // Toggle this section
        >
          <Text>Selected Unit Value: </Text>
        </CollapsibleSection>
        <CollapsibleSection
          icon={<LuLayers />}
          title="Layers"
          defaultOpen={isLayersOpen}
          expandSidebar={expandSidebar} // Use expandSidebar here
          isSidebarCollapsed={isSidebarCollapsed}
          onToggle={() => setIsLayersOpen((prev) => !prev)} // Toggle this section
        >
          <LayerPanel />
        </CollapsibleSection>
      </VStack>
      <Box>
        <IconButton size={"2xs"} onClick={toggleSidebarWidth}>
          <LuChevronLeft />
        </IconButton>
      </Box>
    </VStack>
  );
};

export default Sidebar;
