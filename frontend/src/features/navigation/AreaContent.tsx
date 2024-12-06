import React, { useState, useEffect } from "react";
import {
  Stack,
  HStack,
  Box,
  Separator,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/ui/accordion";
import { accordionItems } from "./AccordionItems";
import NewCustomSize from "./newCustomSize";
import Konva from "konva";
import { LuPlus } from "react-icons/lu";

const AreaContent: React.FC<{
  stageRef: React.RefObject<Konva.Stage>;
  selectedItem: string | null;
  setSelectedItem: (item: string) => void;
}> = ({ selectedItem, setSelectedItem }) => {
  const [value, setValue] = useState(["pixels"]);
  const [customSizes, setCustomSizes] = useState<
    {
      dimension: string;
      description: string;
      width: number;
      height: number;
      unit: "px" | "mm" | "in";
    }[]
  >([]);
  const [isAddingCustomSize, setIsAddingCustomSize] = useState(false); // State to toggle input visibility

  useEffect(() => {
    const savedSizes = localStorage.getItem("customSizes");
    if (savedSizes) {
      setCustomSizes(JSON.parse(savedSizes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("customSizes", JSON.stringify(customSizes));
  }, [customSizes]);

  const handleAddCustomSize = (dimension: string, description: string) => {
    const [width, heightWithUnit] = dimension.split(" x ");
    const unit = heightWithUnit.slice(-2) as "px" | "mm" | "in";
    const height = parseFloat(heightWithUnit);

    const newCustomSize = {
      dimension,
      description,
      width: parseFloat(width),
      height,
      unit,
    };
    setCustomSizes((prev) => [...prev, newCustomSize]);
    setIsAddingCustomSize(false); // Hide the input after adding a new custom size
  };

  const unitToPixelConversion = {
    px: 1,
    mm: 3.779528,
    in: 96,
  };

  const createShape = (
    width: number,
    height: number,
    unit: "px" | "mm" | "in"
  ) => {
    const conversionFactor = unitToPixelConversion[unit];
    const widthInPixels = Math.round(width * conversionFactor);
    const heightInPixels = Math.round(height * conversionFactor);

    const event = new CustomEvent("addShape", {
      detail: {
        width: widthInPixels,
        height: heightInPixels,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <Stack p={0} w="full">
      <AccordionRoot
        p={0}
        w="full" // Make it take the full width
        value={value}
        onValueChange={(e) => setValue(e.value)}
        variant={"plain"}
        size={"sm"}
        fontSize={"2xs"}
        fontWeight={"normal"}
        collapsible
      >
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={item.value}>
            <AccordionItemTrigger
              py={1}
              px={1}
              fontSize={"2xs"}
              fontWeight={"normal"}
            >
              {item.title}
            </AccordionItemTrigger>

            <AccordionItemContent p={0}>
              <Stack w="full" flex={1}>
                {" "}
                {/* Use w="full" for dynamic width */}
                {item.content.map((textItem, idx) => (
                  <HStack
                    px={0} // Remove unnecessary padding for full-width layout
                    key={idx}
                    justify="space-between"
                    bg={
                      selectedItem === textItem.dimension
                        ? "blue.50"
                        : "transparent"
                    }
                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                    onClick={() => {
                      const { width, height, unit } = textItem.dimensions;
                      createShape(width, height, unit as "px" | "mm" | "in");
                      setSelectedItem(textItem.dimension);
                    }}
                    w="full" // Ensure HStack also takes full width
                  >
                    <Box fontWeight="semibold" fontSize="2xs" w="50%">
                      {textItem.dimension}
                    </Box>
                    <Box
                      fontSize="2xs"
                      w="50%"
                      color="gray.400"
                      textAlign="right"
                    >
                      {textItem.description}
                    </Box>
                  </HStack>
                ))}
              </Stack>
            </AccordionItemContent>

            <Separator />
          </AccordionItem>
        ))}

        <AccordionItem value="customSizes" p={0}>
          <AccordionItemTrigger p={1} fontSize={"2xs"} fontWeight={"normal"}>
            <IconButton
              px={0}
              size={"2xs"}
              variant={"plain"}
              fontSize={"2xs"}
              onClick={() => setIsAddingCustomSize((prev) => !prev)} // Toggle input visibility
            >
              Add new custom size
              <LuPlus />
            </IconButton>
          </AccordionItemTrigger>

          <AccordionItemContent p={0}>
            <Stack>
              {customSizes.map((textItem, idx) => (
                <HStack
                  key={idx}
                  justify="space-between"
                  bg={
                    selectedItem === textItem.dimension
                      ? "blue.50"
                      : "transparent"
                  }
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => {
                    createShape(textItem.width, textItem.height, textItem.unit);
                    setSelectedItem(textItem.dimension);
                  }}
                >
                  <Box fontWeight="normal" fontSize="2xs" w="50%">
                    {textItem.dimension}
                  </Box>
                  <Box
                    fontSize="2xs"
                    w="50%"
                    color="gray.400"
                    textAlign="right"
                  >
                    {textItem.description}
                  </Box>
                </HStack>
              ))}
            </Stack>
          </AccordionItemContent>
          <Separator />
        </AccordionItem>
      </AccordionRoot>

      <VStack>
        {isAddingCustomSize && <NewCustomSize onAdd={handleAddCustomSize} />}
      </VStack>
    </Stack>
  );
};

export default AreaContent;
