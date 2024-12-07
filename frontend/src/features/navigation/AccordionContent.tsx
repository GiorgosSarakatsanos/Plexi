import React from "react";
import { HStack, Box } from "@chakra-ui/react";

interface AccordionContentProps {
  items: {
    dimension: string;
    description: string;
    width: number;
    height: number;
    unit: "px" | "mm" | "in";
  }[];
  selectedItem: string | null;
  onSelect: (item: {
    dimension: string;
    width: number;
    height: number;
    unit: "px" | "mm" | "in";
  }) => void;
}

const AccordionContent: React.FC<AccordionContentProps> = ({
  items,
  selectedItem,
  onSelect,
}) => {
  return (
    <>
      {items.map((item, idx) => (
        <HStack
          px={1}
          py={"2px"}
          key={idx}
          justify="space-between"
          bg={selectedItem === item.dimension ? "blue.50" : "transparent"}
          _hover={{ bg: "gray.100", cursor: "pointer" }}
          onClick={() => onSelect(item)}
        >
          <Box fontWeight="semibold" fontSize="xs" w="50%">
            {item.dimension}
          </Box>
          <Box fontSize="xs" w="50%" color="gray.400" textAlign="right">
            {item.description}
          </Box>
        </HStack>
      ))}
    </>
  );
};

export default AccordionContent;
