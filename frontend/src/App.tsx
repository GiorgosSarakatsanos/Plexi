import { Flex, HStack, VStack, Box } from "@chakra-ui/react";
import { useState, useRef } from "react";
import Toolbar from "./features/navigation/Toolbar";
import LeftSidebar from "./features/navigation/LeftSidebar";
import { LayerProvider } from "./features/design/Layer/LayerProvider";
import Canvas from "./features/design/Canvas";
import { SelectedShape } from "./features/design/helpers/ToolTypes";
import Konva from "konva";
import RightSidebar from "./features/navigation/RightSidebar";

const Layout: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [, setSelectedShapeId] = useState<string | null>(null);
  const [, setSelectedLayerIds] = useState<string[]>([]);
  const [selectedShape, setSelectedShape] = useState<SelectedShape>("select");

  // State to manage sidebar width
  const [sidebarWidth, setSidebarWidth] = useState("38px");

  const toggleSidebarWidth = () => {
    setSidebarWidth((prevWidth) => (prevWidth === "38px" ? "250px" : "38px"));
  };

  return (
    <LayerProvider>
      <Flex width="100vw" height="100vh" overflow="hidden">
        {/* Left Sidebar */}
        <Box
          width={sidebarWidth}
          overflow="auto"
          height="100%"
          background="bg.panel"
          borderRight="1px solid"
          borderColor="bg.emphasized"
          zIndex="2"
          overflowX={"hidden"}
        >
          <LeftSidebar
            stageRef={stageRef}
            transformerRef={transformerRef}
            setSelectedShapeId={setSelectedShapeId}
            setSelectedLayerIds={setSelectedLayerIds}
            toggleSidebarWidth={toggleSidebarWidth}
          />
        </Box>

        {/* Canvas */}
        <Box
          flex="1"
          height="100%"
          bg="gray.100"
          overflow="hidden"
          position="relative"
          zIndex={"1"}
        >
          <Canvas
            selectedTool={selectedShape}
            setSelectedTool={setSelectedShape}
          />
        </Box>

        {/* Right Sidebar */}
        <VStack
          width="150px"
          height="100%"
          bg={"bg.panel"}
          borderLeftWidth="1px"
          zIndex={3}
          p={3}
        >
          <RightSidebar />
        </VStack>

        {/* Toolbar */}
        <HStack
          position={"fixed"}
          justify={"center"}
          bottom={"14px"}
          width={"100%"}
          zIndex={4}
          pointerEvents="none"
        >
          <Box
            bg={"bg.panel"}
            borderRadius={"xl"}
            shadow="md"
            position="relative"
            pointerEvents="auto"
          >
            <Box zIndex={5}>
              <Toolbar
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                stageRef={stageRef}
              />
            </Box>
          </Box>
        </HStack>
      </Flex>
    </LayerProvider>
  );
};

export default Layout;
