import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Heading,
  VStack,
  Collapsible,
} from "@chakra-ui/react";

interface CollapsibleSectionProps {
  icon: React.ReactElement;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  expandSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggle: () => void; // New prop to handle toggle
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  icon,
  title,
  children,
  defaultOpen = false,
  expandSidebar,
  isSidebarCollapsed,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Sync the section open state with sidebar collapse state
  useEffect(() => {
    if (isSidebarCollapsed) {
      setIsOpen(false); // Close when sidebar is collapsed
    } else {
      setIsOpen(defaultOpen); // Reopen based on last known state when expanded
    }
  }, [isSidebarCollapsed, defaultOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    onToggle(); // Call the onToggle prop
  };

  return (
    <VStack align="stretch" width="100%">
      <Collapsible.Root open={isOpen}>
        <Collapsible.Trigger as={Box} width="100%" onClick={handleToggle}>
          <Flex justify="space-between" alignItems="center" width="100%">
            <HStack>
              <IconButton
                size="2xs"
                variant="ghost"
                aria-label={title}
                onClick={expandSidebar}
              >
                {icon}
              </IconButton>
              <Heading size="xs" fontWeight="normal">
                {title}
              </Heading>
            </HStack>
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
