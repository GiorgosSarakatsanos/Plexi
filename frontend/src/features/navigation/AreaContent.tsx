import React, { useState, useEffect } from "react";
import { Stack, Separator, VStack, IconButton } from "@chakra-ui/react";
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
import AccordionContent from "./AccordionContent";
import { unitToPixelConversion } from "../utils/unitToPixelConversion";

const AreaContent: React.FC<{
  stageRef: React.RefObject<Konva.Stage>;
  selectedItem: string | null;
  setSelectedItem: (item: string) => void;
}> = ({ selectedItem, setSelectedItem }) => {
  const [value, setValue] = useState(["customSizes"]);
  const [customSizes, setCustomSizes] = useState<
    {
      dimension: string;
      description: string;
      width: number;
      height: number;
      unit: "px" | "mm" | "in";
    }[]
  >([]);
  const [isAddingCustomSize, setIsAddingCustomSize] = useState(false);

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
    setIsAddingCustomSize(false);
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

  const handleSelect = (item: {
    dimension: string;
    width: number;
    height: number;
    unit: "px" | "mm" | "in";
  }) => {
    createShape(item.width, item.height, item.unit);
    setSelectedItem(item.dimension);
  };

  const handleCancel = () => {
    setIsAddingCustomSize(false);
  };

  return (
    <Stack p={0} w="full">
      <AccordionRoot
        p={0}
        w="full"
        value={value}
        onValueChange={(e) => setValue(e.value)}
        variant={"plain"}
        size={"sm"}
        fontSize={"xs"}
        fontWeight={"normal"}
        collapsible
      >
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={item.value}>
            <AccordionItemTrigger
              py={1}
              px={0}
              fontSize={"xs"}
              fontWeight={"normal"}
            >
              {item.title}
            </AccordionItemTrigger>
            <AccordionItemContent p={0}>
              <AccordionContent
                items={item.content.map((contentItem) => ({
                  dimension: contentItem.dimension,
                  description: contentItem.description,
                  width: contentItem.dimensions.width,
                  height: contentItem.dimensions.height,
                  unit: contentItem.dimensions.unit as "px" | "mm" | "in",
                }))}
                selectedItem={selectedItem}
                onSelect={handleSelect}
              />
            </AccordionItemContent>
            <Separator />
          </AccordionItem>
        ))}

        <AccordionItem value="customSizes">
          <AccordionItemTrigger
            px={0}
            py={1}
            fontSize={"xs"}
            fontWeight={"normal"}
          >
            Custom sizes
          </AccordionItemTrigger>
          <AccordionItemContent p={0}>
            <AccordionContent
              items={customSizes}
              selectedItem={selectedItem}
              onSelect={handleSelect}
            />
            <Separator />
            <VStack align={"start"} py={3}>
              <IconButton
                p={0}
                size={"xs"}
                height={2}
                variant={"plain"}
                fontSize={"xs"}
                fontWeight={"normal"}
                onClick={() => setIsAddingCustomSize((prev) => !prev)}
              >
                <LuPlus />
                New custom size
              </IconButton>
              {isAddingCustomSize && (
                <NewCustomSize
                  onAdd={handleAddCustomSize}
                  onCancel={handleCancel}
                />
              )}
            </VStack>
          </AccordionItemContent>
          <Separator />
        </AccordionItem>
      </AccordionRoot>
    </Stack>
  );
};

export default AreaContent;
