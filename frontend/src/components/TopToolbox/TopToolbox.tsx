// components/TopToolbox.tsx
import React from "react";
import { Box, Button, Text, HStack } from "@chakra-ui/react";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "../ui/menu";
import { Group } from "@chakra-ui/react";
import { LuZap } from "react-icons/lu";
import { Avatar } from "../ui/avatar";
import userPhoto from "../../assets/images/user-photo.jpg";

interface TopToolboxProps {
  horizontalMenuItems: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  verticalMenuItems: { label: string; value: string; icon: React.ReactNode }[];
}

const TopToolbox: React.FC<TopToolboxProps> = ({
  horizontalMenuItems,
  verticalMenuItems,
}) => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      p={4}
      zIndex="overlay"
    >
      <HStack justify="end" gap={4} align="center">
        <MenuRoot>
          <MenuTrigger asChild>
            <Button variant="solid" size="2xs" colorPalette="blue">
              <LuZap />
              Quick actions
            </Button>
          </MenuTrigger>
          <MenuContent>
            <Group grow gap="0">
              {horizontalMenuItems.map((item) => (
                <MenuItem
                  key={item.value}
                  value={item.value}
                  width="14"
                  gap="1"
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              ))}
            </Group>
            {verticalMenuItems.map((item) => (
              <MenuItem
                key={item.value}
                value={item.value}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Box flex="1" textAlign="left">
                  {item.label}
                </Box>
                {item.icon}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuRoot>
        <HStack>
          <Avatar size="2xs" name="User" src={userPhoto} />
          <Box boxSize="8px" bg="green" borderRadius="full" />
          <Text textStyle="xs" fontWeight="medium" color="gray.700">
            Online
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default TopToolbox;
