import React, { useState } from "react";
import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor";
import SizeSelector from "./components/SizeSelection/SizeSelector";
import ColorPickerButton from "./components/ColorPickerButton/ColorPickerButton";
import { LayerProvider } from "./components/Layer/LayerContext";

import {
  Box,
  VStack,
  Flex,
  IconButton,
  Button,
  Group,
  Grid,
  GridItem,
  Center,
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
        templateColumns="300px 80px 1fr"
        templateRows="1fr"
        h="100vh"
        gap="4"
        padding="4"
      >
        {/* Sidebar */}
        <GridItem area="sidebar" bg="gray.200" p={4} rounded="xl">
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
                <MenuRoot>
                  <MenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <LuZap />
                      Actions
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
                          justifyContent="center"
                        >
                          {item.icon}
                          {item.label}
                        </MenuItem>
                      ))}
                    </Group>
                    {verticalMenuItems.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        <Box flex="1">{item.label}</Box>
                        {item.icon}
                      </MenuItem>
                    ))}
                  </MenuContent>
                </MenuRoot>
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
            <ColorPickerButton onChangeColor={handleColorChange} />
            <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
          </VStack>
        </GridItem>

        {/* Vertical Toolbox */}
        <GridItem area="toolbar" bg="gray.300" p={4} width="80px" rounded="xl">
          {/* Toolbox Content */}
          <Box>One</Box>
          <Box>
            <Toolbar setSelectedShape={setSelectedShape} />
          </Box>
          <Box>Three</Box>
        </GridItem>

        {/* Main Container with Overflow */}
        <GridItem
          area="main"
          position="relative"
          bg="gray.50"
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
            boxShadow="sm"
            rounded="xl"
          >
            {/* Top Toolbox Content */}
            Top Toolbox
          </Box>

          {/* Canvas Area: Takes all main container space */}
          <Box
            height="100%"
            overflow="auto"
            pt={4}
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
