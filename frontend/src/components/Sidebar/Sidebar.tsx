// components/Sidebar/Sidebar.tsx
import React from "react";
import {
  VStack,
  Box,
  Flex,
  HStack,
  IconButton,
  Collapsible,
  Heading,
  Separator,
} from "@chakra-ui/react";
import { LuAtom, LuChevronDown, LuPanelRightOpen } from "react-icons/lu";
import SizeSelector from "../SizeSelection/SizeSelector";
import ColorPickerButton from "../ColorPickerButton/ColorPickerButton";

interface SidebarProps {
  onSizeSelect: (
    width: number,
    height: number,
    unit: "mm" | "cm" | "in" | "px"
  ) => void;
  handleColorChange: (color: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSizeSelect,
  handleColorChange,
}) => {
  return (
    <VStack align="stretch" height="100%" gap={2}>
      {/* Logo and Menu Box */}
      <HStack gap="4" justifyContent="space-between">
        <IconButton aria-label="Logo" rounded="full" variant="ghost" size="xl">
          <LuAtom />
        </IconButton>
        <IconButton
          aria-label="Close panel"
          rounded="full"
          variant="ghost"
          size="2xs"
        >
          <LuPanelRightOpen />
        </IconButton>
      </HStack>

      {/* Options starts here */}
      <Collapsible.Root>
        <Collapsible.Trigger width="100%">
          {" "}
          {/* Ensure full width here */}
          <Flex justifyContent="space-between" alignItems="center" width="100%">
            <Heading size="md" flex="1">
              {" "}
              {/* Use flex="1" to make Heading take up extra space */}
              Setup Canvas
            </Heading>
            <IconButton size="xs" variant="ghost">
              <LuChevronDown />
            </IconButton>
          </Flex>
        </Collapsible.Trigger>
        <Collapsible.Content width="100%" padding="4 0">
          {" "}
          {/* Optional: Ensure full width on content */}
          <VStack align="start" gap={4} padding={4 - 2} width="100%">
            <Box width="100%">
              <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
            </Box>
            <Box width="100%">
              <ColorPickerButton onChangeColor={handleColorChange} />
            </Box>
          </VStack>
        </Collapsible.Content>
      </Collapsible.Root>
      <Separator />
    </VStack>
  );
};

export default Sidebar;
