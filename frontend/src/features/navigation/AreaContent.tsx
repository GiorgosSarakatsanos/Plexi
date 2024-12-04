import React, { useState, useEffect } from "react";
import { Stack, HStack, Box, Separator, VStack } from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/ui/accordion";
import { accordionItems } from "./AccordionItems";
import NewCustomSize from "./newCustomSize";

const AreaContent: React.FC<{
  selectedItem: string | null;
  setSelectedItem: (item: string) => void;
}> = ({ selectedItem, setSelectedItem }) => {
  const [value, setValue] = useState(["pixels"]);
  const [customSizes, setCustomSizes] = useState<
    { dimension: string; description: string }[]
  >([]);

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
    const newCustomSize = { dimension, description };
    setCustomSizes((prev) => [...prev, newCustomSize]);
  };

  const unitToPixelConversion = {
    px: 1,
    mm: 3.779528,
    in: 96,
  };

  return (
    <Stack>
      <AccordionRoot
        p={0}
        value={value}
        onValueChange={(e) => setValue(e.value)}
        variant={"plain"}
        size={"sm"}
        fontSize={"xs"}
        fontWeight={"normal"}
      >
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={item.value}>
            <AccordionItemTrigger
              height={"45px"}
              px={3}
              fontSize={"xs"}
              fontWeight={"normal"}
            >
              {item.title}
            </AccordionItemTrigger>

            <AccordionItemContent py={1}>
              <Stack>
                {item.content.map((textItem, idx) => (
                  <HStack
                    px={3}
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
                      const conversionFactor =
                        unitToPixelConversion[
                          unit as keyof typeof unitToPixelConversion
                        ];

                      const widthInPixels = Math.round(
                        width * conversionFactor
                      );
                      const heightInPixels = Math.round(
                        height * conversionFactor
                      );

                      const formattedDimensions = `width: ${widthInPixels}, height: ${heightInPixels}, unit: ${unit}`;
                      console.log(formattedDimensions);

                      setSelectedItem(textItem.dimension);
                    }}
                  >
                    <Box fontWeight="normal" fontSize="xs" w="50%">
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

        <AccordionItem value="customSizes">
          <AccordionItemTrigger
            height={"45px"}
            px={3}
            fontSize={"xs"}
            fontWeight={"normal"}
          >
            Custom Sizes
          </AccordionItemTrigger>

          <AccordionItemContent py={1}>
            <Stack>
              {customSizes.map((textItem, idx) => (
                <HStack
                  px={3}
                  key={idx}
                  justify="space-between"
                  bg={
                    selectedItem === textItem.dimension
                      ? "blue.50"
                      : "transparent"
                  }
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedItem(textItem.dimension);
                  }}
                >
                  <Box fontWeight="normal" fontSize="xs" w="50%">
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
        <NewCustomSize onAdd={handleAddCustomSize} />
      </VStack>
      <Separator />
    </Stack>
  );
};

export default AreaContent;
