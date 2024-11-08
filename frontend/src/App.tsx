import React, { useState } from "react";
import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import { useCanvasSize } from "./components/Canvas/useCanvasSize";
import { useColor } from "./hooks/useColor";
import Sidebar from "./components/Sidebar/Sidebar";
import TopToolbox from "./components/TopToolbox/TopToolbox";
import { LayerProvider } from "./components/Layer/LayerContext";
import { Box, Flex, Grid, GridItem, Center } from "@chakra-ui/react";
import {
  horizontalMenuItems,
  verticalMenuItems,
} from "./components/TopToolbox/menuItems"; // Import menu items

const Layout: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize();
  const { color: backgroundColor, handleColorChange } = useColor();
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [canvasOpacity, setCanvasOpacity] = useState(100);

  const handleOpacityChange = (opacity: number) => {
    setCanvasOpacity(opacity); // Update the canvas opacity
  };

  return (
    <LayerProvider>
      <Grid
        templateAreas={`"sidebar toolbar main"
                      "sidebar toolbar main"`}
        templateColumns="300px auto 1fr"
        templateRows="1fr"
        h="100vh"
        padding="2"
        bg="bg.panel"
      >
        {/* Sidebar */}
        <GridItem area="sidebar" p={2} rounded="xl">
          <Sidebar
            onSizeSelect={onSizeSelect}
            handleColorChange={handleColorChange}
            handleOpacityChange={handleOpacityChange}
          />
        </GridItem>

        {/* Toolbox */}
        <GridItem
          area="toolbar"
          p={2}
          borderTopRightRadius="0"
          borderBottomRightRadius="0"
          borderTopLeftRadius="xl"
          borderBottomLeftRadius="xl"
          bg="bg.subtle"
        >
          <Flex direction="column" justifyContent="space-around" height="100%">
            <Box>
              <Toolbar setSelectedShape={setSelectedShape} />
            </Box>
          </Flex>
        </GridItem>

        {/* Main Container with Overflow */}
        <GridItem
          area="main"
          position="relative"
          bg="bg.subtle"
          overflow="auto"
          borderTopRightRadius="xl"
          borderBottomRightRadius="xl"
          borderTopLeftRadius="0"
          borderBottomLeftRadius="0"
        >
          {/* Top Toolbox */}
          <TopToolbox
            horizontalMenuItems={horizontalMenuItems}
            verticalMenuItems={verticalMenuItems}
          />

          {/* Canvas Area */}
          <Box
            width="100%"
            height="100%"
            overflow="auto"
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Center height="100%">
              <Box
                position="relative"
                width={canvasSize.width}
                height={canvasSize.height}
              >
                {/* Checkerboard Background */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  bgImage="url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><rect width=%2240%22 height=%2240%22 fill=%22%23ccc%22 /><rect width=%2220%22 height=%2220%22 fill=%22%23eee%22 /><rect x=%2220%22 y=%2220%22 width=%2220%22 height=%2220%22 fill=%22%23eee%22 /></svg>')"
                  opacity={canvasOpacity < 100 ? 1 : 0} // Show only when opacity is less than 100%
                  zIndex={1}
                />

                {/* Canvas Component */}
                <Box position="relative" zIndex={2}>
                  <Canvas
                    width={canvasSize.width}
                    height={canvasSize.height}
                    backgroundColor={backgroundColor}
                    selectedShape={selectedShape}
                    opacity={canvasOpacity}
                  />
                </Box>
              </Box>
            </Center>
          </Box>
        </GridItem>
      </Grid>
    </LayerProvider>
  );
};

export default Layout;
