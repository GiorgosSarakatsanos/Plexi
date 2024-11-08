import React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Heading,
  Collapsible,
  VStack,
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
}) => (
  <VStack align="stretch" width="100%">
    <Collapsible.Root defaultOpen={defaultOpen}>
      <Collapsible.Trigger as={Box} width="100%">
        <Flex justify="space-between" alignItems="center" width="100%">
          <HStack>
            <IconButton size="2xs" variant="ghost" aria-label={title}>
              {icon}
            </IconButton>
            <Heading size="xs" fontWeight="normal">
              {title}
            </Heading>
          </HStack>
          <Switch variant="raised" size="xs" colorPalette="blue" />
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

export default CollapsibleSection;
