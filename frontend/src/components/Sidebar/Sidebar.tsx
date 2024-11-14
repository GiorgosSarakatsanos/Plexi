import React, { useState, useEffect } from "react";
import { VStack, Text, Box, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuImage, LuLayout, LuPalette } from "react-icons/lu";
import SizeSelector from "../SizeSelection/SizeSelector";
import ColorPickerButton from "../ColorPickerButton/ColorPickerButton";
import CollapsibleSection from "./CollapsibleSection";
import { useUnit } from "../../utils/UnitContext";

interface SidebarProps {
  onSizeSelect: (
    width: number,
    height: number,
    unit: "mm" | "cm" | "in" | "px"
  ) => void;
  handleColorChange: (color: string) => void;
  handleOpacityChange: (opacity: number) => void;
  toggleSidebarWidth: () => void;
  expandSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSizeSelect,
  handleColorChange,
  handleOpacityChange,
  toggleSidebarWidth,
  expandSidebar, // Expand-only function
  isSidebarCollapsed,
}) => {
  const { unit } = useUnit();

  // State for each section's open status
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(true);

  // Close all sections when the sidebar is collapsed
  useEffect(() => {
    if (isSidebarCollapsed) {
      setIsSizeOpen(false);
      setIsColorOpen(false);
      setIsGridOpen(false);
    }
  }, [isSidebarCollapsed]);

  return (
    <VStack align="stretch" justify={"space-between"} height="100%">
      <VStack gap={2}>
        <CollapsibleSection
          icon={<LuImage />}
          title="Size"
          defaultOpen={isSizeOpen}
          expandSidebar={expandSidebar} // Use expandSidebar here
          isSidebarCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSizeOpen((prev) => !prev)} // Toggle this section
        >
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
        </CollapsibleSection>

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
          <Text>Selected Unit Value: {unit}</Text>
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
