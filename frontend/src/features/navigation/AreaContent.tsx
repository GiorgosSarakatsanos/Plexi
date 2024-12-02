import React, { useState } from "react";
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
                      setSelectedItem(textItem.dimension);
                    }}
                  >
                    {/* Dimension Box */}
                    <Box fontWeight="normal" fontSize="xs" w="50%">
                      {textItem.dimension}
                    </Box>
                    {/* Description Box */}
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
      </AccordionRoot>

      <VStack>
        <NewCustomSize />
      </VStack>
      <Separator />
    </Stack>
  );
};

export default AreaContent;
