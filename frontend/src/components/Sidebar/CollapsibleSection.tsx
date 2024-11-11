import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Heading,
  VStack,
  Collapsible,
} from "@chakra-ui/react";
import { Switch } from "../ui/switch";

interface CollapsibleSectionProps {
  icon: React.ReactElement;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  icon,
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
  };

  return (
    <VStack align="stretch" width="100%">
      <Collapsible.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Collapsible.Trigger as={Box} width="100%" onClick={handleToggle}>
          <Flex justify="space-between" alignItems="center" width="100%">
            <HStack>
              <IconButton size="2xs" variant="ghost" aria-label={title}>
                {icon}
              </IconButton>
              <Heading size="xs" fontWeight="normal">
                {title}
              </Heading>
            </HStack>
            <Switch
              variant="raised"
              size="xs"
              colorPalette="blue"
              checked={isOpen}
              onClick={(event) => event.stopPropagation()} // Prevents the Trigger from toggling
              onChange={handleToggle}
            />
          </Flex>
        </Collapsible.Trigger>
        <Collapsible.Content width="100%">
          <Box pt={2} pb={2}>
            {children}
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </VStack>
  );
};

export default CollapsibleSection;
