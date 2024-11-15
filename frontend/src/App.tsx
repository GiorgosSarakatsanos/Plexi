import {
  Flex,
  HStack,
  IconButton,
  Heading,
  VStack,
  Stack,
  Center,
} from "@chakra-ui/react";
import { LuAtom } from "react-icons/lu";
import { useState } from "react";
import TopToolbar from "./components/TopToolbar/TopToolbar";
import {
  horizontalMenuItems,
  verticalMenuItems,
} from "./components/TopToolbar/menuItems";
import Sidebar from "./components/Sidebar/Sidebar";
import { useColor } from "./hooks/useColor";
import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";

import { UnitProvider } from "./utils/UnitContext";
import { LayerProvider } from "./components/Layer/LayerProvider";

const Layout: React.FC = () => {
    const [selectedShape, setSelectedShape] = useState<string | null>("select");

  const { color: backgroundColor, handleColorChange } = useColor();
  const [canvasOpacity, setCanvasOpacity] = useState(100);
  const handleOpacityChange = (opacity: number) => {
    setCanvasOpacity(opacity); // Update the canvas opacity
  };

  // Define barSize for the top bar height
  const barSize = "45px";

  const [sidebarWidth, setSidebarWidth] = useState("275px");
  const isSidebarCollapsed = sidebarWidth === barSize;

  // Toggle sidebar width between expanded and collapsed
  const toggleSidebarWidth = () => {
    setSidebarWidth((prevWidth) => (prevWidth === "275px" ? barSize : "275px"));
  };

  // Expand sidebar only if it's currently collapsed
  const expandSidebar = () => {
    if (sidebarWidth === barSize) {
      setSidebarWidth("275px");
    }
  };

  return (
    <LayerProvider>
      <UnitProvider>
        <Flex
          className="main-wrapper"
          width="100%"
          height="100vh"
          overflow="hidden"
          boxSizing={"border-box"}
        >
          {/* Top bar */}
          <HStack
            justify="space-between"
            className="top-bar"
            h={barSize} // Use barSize here
            width="100%"
            position="fixed"
            zIndex={2}
            background="bg.panel"
            borderBottomWidth={"1px"}
          >
            {/* Area in top of the sidebar */}
            <HStack
              justifyContent="space-between"
              width="275px"
              p={2}
              borderRightWidth={"1px"}
            >
              <HStack gap={2}>
                <IconButton
                  variant="subtle"
                  rounded="xl"
                  size="2xs"
                  colorPalette="blue"
                >
                  <LuAtom />
                </IconButton>
                <Heading size="xs" fontWeight="bold">
                  Plexi
                </Heading>
              </HStack>
            </HStack>

            {/* Area on top of the canvas */}
            <VStack alignItems="right" p={2}>
              <TopToolbar
                horizontalMenuItems={horizontalMenuItems}
                verticalMenuItems={verticalMenuItems}
              />
            </VStack>
          </HStack>

          {/* Sidebar */}
          <Stack
            className="side-bar"
            w={sidebarWidth}
            height={`calc(100vh - ${barSize})`} // Use barSize here
            position="fixed"
            p={2}
            inset={`${barSize} 0px 0px 0px`} // Use barSize here
            background="bg.panel"
            zIndex={4}
            transition="width 0.3s ease"
            borderRightWidth={"1px"}
            flexWrap={"nowrap"}
            overflow="hidden" // Prevents content from wrapping
          >
            <Sidebar
              handleColorChange={handleColorChange}
              handleOpacityChange={handleOpacityChange}
              toggleSidebarWidth={toggleSidebarWidth}
              expandSidebar={expandSidebar}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </Stack>

          {/* Canvas */}
          <Center
            className="canvas"
            height={`calc(100vh - ${barSize})`} // Use barSize here
            w="auto"
            position="absolute"
            background="bg.emphasized"
            inset={`${barSize} 0px 0px ${sidebarWidth}`} // Use barSize and sidebarWidth here
            zIndex={1}
            overflow={"auto"}
            css={{
              "&::-webkit-scrollbar": {
                width: "6px",
                height: "6px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
                height: "6px",
                background: "bg.panel",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray.300",
                borderRadius: "24px",
              },
            }}
          >
            <Canvas
              backgroundColor={backgroundColor}
              selectedShape={selectedShape}
              opacity={canvasOpacity}
              setSelectedShape={setSelectedShape} // Pass the setter function
            />
          </Center>

          {/* Tool bar */}
          <Flex
            position={"fixed"}
            h="calc({barSize} + 4px)"
            bottom={"14px"}
            width={"100%"}
            justify={"center"}
            zIndex={3}
          >
            <HStack>
              <Toolbar
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
              />
            </HStack>
          </Flex>
        </Flex>
      </UnitProvider>
    </LayerProvider>
  );
};

export default Layout;
