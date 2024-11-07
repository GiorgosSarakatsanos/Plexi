import React, { useState } from "react";
import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor";
import SizeSelector from "./components/SizeSelection/SizeSelector";
import ColorPickerButton from "./components/ColorPickerButton/ColorPickerButton";
import { LayerProvider } from "./components/Layer/LayerContext";
import { Avatar } from "./components/ui/avatar";
import userPhoto from "./assets/images/user-photo.jpg";

import {
  Box,
  VStack,
  Flex,
  Fieldset,
  IconButton,
  Text,
  Button,
  Group,
  Grid,
  GridItem,
  Center,
  Tabs,
} from "@chakra-ui/react";

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "./components/ui/menu";

import {
  LuClipboard,
  LuCopy,
  LuFileSearch,
  LuMessageSquare,
  LuScissors,
  LuShare,
  LuAtom,
  LuZap,
  LuPanelRightOpen,
  LuImage,
  LuStickyNote,
} from "react-icons/lu";

const Layout: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { color: backgroundColor, handleColorChange } = useColor();
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const horizontalMenuItems = [
    { label: "Cut", value: "cut", icon: <LuScissors /> },
    { label: "Copy", value: "copy", icon: <LuCopy /> },
    { label: "Paste", value: "paste", icon: <LuClipboard /> },
  ];

  const verticalMenuItems = [
    { label: "Look Up", value: "look-up", icon: <LuFileSearch /> },
    { label: "Translate", value: "translate", icon: <LuMessageSquare /> },
    { label: "Share", value: "share", icon: <LuShare /> },
  ];

  return (
    <LayerProvider>
      <Grid
        templateAreas={`"sidebar toolbar main"
                      "sidebar toolbar main"`}
        templateColumns="300px 50px 1fr"
        templateRows="1fr"
        h="100vh"
        gap="4"
        padding="4"
      >
        {/* Sidebar */}
        <GridItem area="sidebar" bg="blue.50" p={4} rounded="xl">
          {/* Sidebar Content */}
          <VStack align="stretch" height="100%">
            {/* Logo and Menu Box */}
            <Flex gap="4" justifyContent="space-between">
              <div>
                <IconButton aria-label="Logo" rounded="full" variant="ghost">
                  <LuAtom />
                </IconButton>
              </div>
              <div>
                <IconButton
                  aria-label="Close panel"
                  rounded="full"
                  variant="ghost"
                >
                  <LuPanelRightOpen />
                </IconButton>
              </div>
            </Flex>
            <Box>
              <Tabs.Root defaultValue="image">
                <Tabs.List>
                  <Tabs.Trigger value="image">
                    <LuImage />
                    Image
                  </Tabs.Trigger>
                  <Tabs.Trigger value="page">
                    <LuStickyNote />
                    Page
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="image">
                  <VStack>
                    <Fieldset.Root>
                      <Fieldset.Legend>Canvas size</Fieldset.Legend>
                      <Fieldset.Content>
                        <Box>
                          <SizeSelector
                            type="imageSize"
                            onSizeSelect={onSizeSelect}
                          />
                        </Box>
                      </Fieldset.Content>
                    </Fieldset.Root>
                    <Fieldset.Root>
                      <Fieldset.Legend>Canvas color</Fieldset.Legend>
                      <Fieldset.Content>
                        <Box>
                          <ColorPickerButton
                            onChangeColor={handleColorChange}
                          />
                        </Box>
                      </Fieldset.Content>
                    </Fieldset.Root>
                    <Fieldset.Root>
                      <Fieldset.Legend>Grid setup</Fieldset.Legend>
                      <Fieldset.Content>
                        <Box></Box>
                      </Fieldset.Content>
                    </Fieldset.Root>
                  </VStack>
                  <VStack></VStack>
                </Tabs.Content>
                <Tabs.Content value="page">Manage your projects</Tabs.Content>
              </Tabs.Root>
            </Box>
          </VStack>
        </GridItem>

        {/* Toolbox */}
        <GridItem area="toolbar" rounded="xl" padding="1">
          {/* Toolbox Content */}
          <Flex direction="column" justifyContent="space-between" height="100%">
            <Box>One</Box>
            <Box>
              <Toolbar setSelectedShape={setSelectedShape} />
            </Box>
            <Box>Three</Box>
          </Flex>
        </GridItem>

        {/* Main Container with Overflow */}
        <GridItem
          area="main"
          position="relative"
          bg="gray.300"
          overflow="auto"
          rounded="xl"
        >
          {/* Top Toolbox: Positioned absolutely, doesn't affect canvas area */}
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            p={4}
            zIndex="overlay"
          >
            {/* Top Toolbox Content */}
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
                          justifyContent="flex-start" // Align content to the left
                          alignItems="flex-start" // Ensure content is aligned to the left
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

          {/* Canvas Area: Takes all main container space */}
          <Box
            height="100%"
            overflow="auto"
            p={4}
            ml={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Center>
              <Canvas
                width={canvasSize.width}
                height={canvasSize.height}
                backgroundColor={backgroundColor}
                selectedShape={selectedShape}
              />
            </Center>
          </Box>
        </GridItem>
      </Grid>
    </LayerProvider>
  );
};

export default Layout;
