import React from "react";
import {
  VStack,
  Flex,
  HStack,
  Box,
  Collapsible,
  Heading,
  Separator,
  Center,
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
  handleOpacityChange: (opacity: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSizeSelect,
  handleColorChange,
  handleOpacityChange,
}) => {
  return (
    <VStack align="stretch" height="100%" gap={2}>
      {/* Logo and Menu Box */}
      <HStack justifyContent="space-between">
        <Center gap={2}>
          <Box as="span" aria-label="Logo" rounded="full">
            <LuAtom />
          </Box>
          <Heading size="xs">Plexi</Heading>
        </Center>
        <Box as="span" aria-label="Close panel" rounded="full">
          <LuPanelRightOpen />
        </Box>
      </HStack>
      <Separator />

      {/* Options starts here */}
      <VStack align="left">
        <Collapsible.Root>
          <Collapsible.Trigger as={Box} width="100%">
            <Flex justify="space-between" alignItems="center" width="100%">
              <Heading size="sm">Canvas setup</Heading>
              <Box>
                <LuChevronDown />
              </Box>
            </Flex>
          </Collapsible.Trigger>
          <Collapsible.Content width="100%">
            <Flex gap={2} direction="column" pt={2} pb={2}>
              <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
              <ColorPickerButton
                onChangeColor={handleColorChange}
                onOpacityChange={handleOpacityChange}
              />
            </Flex>
          </Collapsible.Content>
        </Collapsible.Root>
      </VStack>
      <Separator />
    </VStack>
  );
};

export default Sidebar;
