// components/TopToolbox.tsx
import React from "react";
import { Box, Flex, Button, Text } from "@chakra-ui/react";
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
      <Flex justify="space-between" align="center">
        <Box>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="solid" size="xs" colorPalette="blue">
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
        </Box>
        <Flex align="flex-start">Selected item actions</Flex>
        <Flex gap={2} align="center">
          <Box>
            <Avatar size="2xs" name="User" src={userPhoto} />
          </Box>
          <Box boxSize="8px" bg="green" borderRadius="full" />
          <Box>
            <Text textStyle="xs" fontWeight="medium" color="gray.700">
              Online
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopToolbox;
