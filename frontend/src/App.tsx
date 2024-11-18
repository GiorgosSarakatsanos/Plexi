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
import { useState, useRef } from "react";
import TopToolbar from "./components/TopToolbar/TopToolbar";
import {
  horizontalMenuItems,
  verticalMenuItems,
} from "./components/TopToolbar/menuItems";
import Sidebar from "./components/Sidebar/Sidebar";
import { useColor } from "./hooks/useColor";
import Canvas, { CanvasRef } from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import { LayerProvider } from "./components/Layer/LayerProvider";

const Layout: React.FC = () => {
  const canvasRef = useRef<CanvasRef>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const { color: backgroundColor, handleColorChange } = useColor();
  const [canvasOpacity, setCanvasOpacity] = useState(100);

  // Add selectedShape state
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const handleOpacityChange = (opacity: number) => {
    setCanvasOpacity(opacity);
  };

  const barSize = "45px";
  const [sidebarWidth, setSidebarWidth] = useState("275px");
  const isSidebarCollapsed = sidebarWidth === barSize;

  const toggleSidebarWidth = () => {
    setSidebarWidth((prevWidth) => (prevWidth === "275px" ? barSize : "275px"));
  };

  const expandSidebar = () => {
    if (sidebarWidth === barSize) {
      setSidebarWidth("275px");
    }
  };

  const calculatedWidth = window.innerWidth - parseInt(sidebarWidth);
  const calculatedHeight = window.innerHeight - parseInt(barSize);

  const setZoomToPercentage = (percentage: number) => {
    if (canvasRef.current) {
      canvasRef.current.setZoomToPercentage(percentage);
      setZoomLevel(percentage);
    }
  };

  const zoomIn = () => {
    if (canvasRef.current) {
      canvasRef.current.zoomIn();
      updateZoomLevel();
    }
  };

  const zoomOut = () => {
    if (canvasRef.current) {
      canvasRef.current.zoomOut();
      updateZoomLevel();
    }
  };

  const updateZoomLevel = () => {
    if (canvasRef.current) {
      const stage = canvasRef.current.getStage();
      if (stage) {
        const scale = stage.scaleX();
        setZoomLevel(Math.round(scale * 100));
      }
    }
  };

  return (
    <LayerProvider>
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
          h={barSize}
          width="100%"
          position="fixed"
          zIndex={2}
          background="bg.panel"
          borderBottomWidth={"1px"}
        >
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

          <VStack alignItems="right" p={2}>
            <TopToolbar
              zoomLevel={zoomLevel}
              horizontalMenuItems={horizontalMenuItems}
              verticalMenuItems={verticalMenuItems}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              setZoomToPercentage={setZoomToPercentage}
            />
          </VStack>
        </HStack>

        {/* Sidebar */}
        <Stack
          className="side-bar"
          w={sidebarWidth}
          height={`calc(100vh - ${barSize})`}
          position="fixed"
          p={2}
          inset={`${barSize} 0px 0px 0px`}
          background="bg.panel"
          zIndex={4}
          transition="width 0.3s ease"
          borderRightWidth={"1px"}
          flexWrap={"nowrap"}
          overflow="hidden"
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
          height={`calc(100vh - ${barSize})`}
          w="auto"
          position="absolute"
          background="bg.emphasized"
          inset={`${barSize} 0px 0px ${sidebarWidth}`}
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
            ref={canvasRef}
            width={`${calculatedWidth}`}
            height={`${calculatedHeight}`}
            backgroundColor={backgroundColor}
            opacity={canvasOpacity}
            onZoomChange={setZoomLevel}
            selectedShape={selectedShape} // Pass the selectedShape here
          />
        </Center>

        {/* Toolbar */}
        <Flex
          position={"fixed"}
          h="calc({barSize} + 4px)"
          bottom={"14px"}
          width={"100%"}
          justify={"center"}
          zIndex={3}
        >
          <HStack dropShadow={"xs"}>
            <Toolbar
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
            />
          </HStack>
        </Flex>
      </Flex>
    </LayerProvider>
  );
};

export default Layout;
