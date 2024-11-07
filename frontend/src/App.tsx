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

  return (
    <LayerProvider>
      <Grid
        templateAreas={`"sidebar toolbar main"
                      "sidebar toolbar main"`}
        templateColumns="320px auto 1fr"
        templateRows="1fr"
        h="100vh"
        gap="2"
        padding="4"
      >
        {/* Sidebar */}
        <GridItem area="sidebar" bg="blue.50" p={4} rounded="xl">
          <Sidebar
            onSizeSelect={onSizeSelect}
            handleColorChange={handleColorChange}
          />
        </GridItem>

        {/* Toolbox */}
        <GridItem area="toolbar" rounded="xl" padding="1">
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
          {/* Top Toolbox */}
          <TopToolbox
            horizontalMenuItems={horizontalMenuItems}
            verticalMenuItems={verticalMenuItems}
          />

          {/* Canvas Area */}
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
