// TopToolbar.tsx
import React from "react";
import { Box, Button, Text, HStack } from "@chakra-ui/react";
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuItemCommand,
} from "../ui/menu";
import { Group } from "@chakra-ui/react";
import { LuZap } from "react-icons/lu";
import { Avatar } from "../ui/avatar";
import userPhoto from "../../assets/images/user-photo.jpg";
import { useZoom } from "../../utils/useZoom";

interface TopToolbarProps {
  horizontalMenuItems: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  verticalMenuItems: { label: string; value: string; icon: React.ReactNode }[];
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  horizontalMenuItems,
  verticalMenuItems,
}) => {
  // Get zoom controls from useZoom hook
  const { zoomLevel, zoomIn, zoomOut, setZoomToPercentage } = useZoom();

  return (
    <HStack>
      {/* Quick Actions Menu */}
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

      {/* Zoom Level Menu */}
      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="ghost" size="2xs">
            {Math.round(zoomLevel * 100)}%
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={zoomIn} value="zoom-in">
            Zoom in <MenuItemCommand>+</MenuItemCommand>
          </MenuItem>
          <MenuItem onClick={zoomOut} value="zoom-out">
            Zoom out <MenuItemCommand>-</MenuItemCommand>
          </MenuItem>

          <MenuItem onClick={() => setZoomToPercentage(50)} value="zoom-50">
            Half size <MenuItemCommand>Ctrl+2</MenuItemCommand>
          </MenuItem>
          <MenuItem onClick={() => setZoomToPercentage(100)} value="zoom-100">
            Actual size <MenuItemCommand>Ctrl+1</MenuItemCommand>
          </MenuItem>
        </MenuContent>
      </MenuRoot>

      {/* User Status and Avatar */}
      <HStack>
        <Avatar size="2xs" name="User" src={userPhoto} />
        <Box boxSize="8px" bg="green" borderRadius="full" />
        <Text textStyle="xs" fontWeight="medium" color="gray.700">
          Online
        </Text>
      </HStack>
    </HStack>
  );
};

export default TopToolbar;
