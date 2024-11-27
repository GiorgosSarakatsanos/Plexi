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
import Sidebar from "./components/Sidebar/Sidebar";
import Toolbar from "./components/Toolbar/Toolbar";
import { LayerProvider } from "./components/Layer/LayerProvider";
import Canvas from "./components/Canvas/Canvas";
import { SelectedShape } from "./components/Tools/ToolTypes";

const Layout: React.FC = () => {
  // Add selectedShape state
  const [selectedShape, setSelectedShape] = useState<SelectedShape>("select");

  const barSize = "45px";
  const [sidebarWidth, setSidebarWidth] = useState("275px");
  const isSidebarCollapsed = sidebarWidth === barSize;

  const toggleSidebarWidth = () => {
    setSidebarWidth((prevWidth) => (prevWidth === "275px" ? barSize : "275px"));
  };

  const handleUploadImage = () => {
    console.log("Image upload triggered!");
    // Add actual image upload logic here
  };

  const expandSidebar = () => {
    if (sidebarWidth === barSize) {
      setSidebarWidth("275px");
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

          <VStack alignItems="right" p={2}></VStack>
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
            selectedTool={selectedShape}
            setSelectedTool={setSelectedShape}
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
              handleUploadImage={handleUploadImage}
            />
          </HStack>
        </Flex>
      </Flex>
    </LayerProvider>
  );
};

export default Layout;
