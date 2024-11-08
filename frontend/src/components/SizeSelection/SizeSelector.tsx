import React, { useState, useEffect } from "react";
import {
  Input,
  HStack,
  Button,
  VStack,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { CloseButton } from "../ui/close-button";
import SizeInputComponent from "./SizeInput";
import { sizeMap } from "./SizeMap";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "../ui/select";

interface SizeSelectorProps {
  type: "paperSize" | "imageSize";
  onSizeSelect: (
    width: number,
    height: number,
    unit: "mm" | "cm" | "in" | "px"
  ) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ type, onSizeSelect }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("mm");
  const [name, setName] = useState("");
  const [customSizes, setCustomSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");

  const predefinedSizes = sizeMap[type].predefined;
  const units = sizeMap[type].units;

  // Load custom sizes from local storage
  useEffect(() => {
    if (!selectedSize && predefinedSizes.length > 0) {
      const defaultSize = predefinedSizes[0];
      setSelectedSize(defaultSize);

      const sizeMatch = defaultSize.match(/(\d+)\s*x\s*(\d+)/);
      if (sizeMatch) {
        const [width, height] = sizeMatch.slice(1).map(parseFloat);
        onSizeSelect(width, height, unit as "mm" | "cm" | "in" | "px");
      }
    }
  }, [selectedSize, predefinedSizes, onSizeSelect, unit]);

  const handleSelectChange = (size: string) => {
    const sizeMatch = size.match(/(\d+)\s*x\s*(\d+)/);
    if (sizeMatch) {
      const [width, height] = sizeMatch.slice(1).map(parseFloat);
      setSelectedSize(size);
      onSizeSelect(width, height, unit as "mm" | "cm" | "in" | "px");
    }
  };

  const sizeCollection = createListCollection({
    items: [
      ...predefinedSizes.map((size) => ({ label: size, value: size })),
      ...customSizes.map((size) => ({ label: size, value: size })),
    ],
  });

  const handleConfirmCustomSize = () => {
    const widthValue = parseFloat(width);
    const heightValue = parseFloat(height);

    if (!widthValue || !heightValue || widthValue < 5 || heightValue < 5) {
      alert("Please enter valid dimensions (at least 5 units).");
      return;
    }

    const tempSize = `${widthValue} x ${heightValue} ${unit}`;

    // Temporarily add custom size and set as selected
    setCustomSizes((prevSizes) => [...prevSizes, tempSize]);
    setSelectedSize(tempSize);
    onSizeSelect(widthValue, heightValue, unit as "mm" | "cm" | "in" | "px");

    setIsCustom(false);
    setWidth("");
    setHeight("");
    setUnit(units[0]);
    setShowNameInput(true); // Show input for naming the custom size
  };

  const handleSaveNamedSize = () => {
    if (!name.trim()) {
      alert("Please provide a name for the custom size.");
      return;
    }

    const newSizeWithName = `${name.trim()} (${selectedSize})`;
    const updatedSizes = customSizes.map((size) =>
      size === selectedSize ? newSizeWithName : size
    );

    setCustomSizes(updatedSizes);
    setSelectedSize(newSizeWithName); // Set the new custom size as selected
    localStorage.setItem(`${type}CustomSizes`, JSON.stringify(updatedSizes));

    setName("");
    setShowNameInput(false);
  };

  const handleRemoveCustomSize = (sizeToRemove: string) => {
    const updatedSizes = customSizes.filter((size) => size !== sizeToRemove);
    setCustomSizes(updatedSizes);
    localStorage.setItem(`${type}CustomSizes`, JSON.stringify(updatedSizes));
  };

  return (
    <VStack align="start">
      <SelectRoot collection={sizeCollection} size="xs">
        <SelectTrigger>
          <Text>{selectedSize || "Select Size"}</Text>
        </SelectTrigger>
        <SelectContent>
          {predefinedSizes.map((size) => (
            <SelectItem
              key={size}
              item={{ label: size, value: size }}
              onClick={() => handleSelectChange(size)}
            >
              {size}
            </SelectItem>
          ))}
          {customSizes.map((size) => (
            <SelectItem
              key={size}
              item={{ label: size, value: size }}
              onClick={() => handleSelectChange(size)}
            >
              <HStack>
                <Text>{size}</Text>
                <CloseButton
                  size="2xs"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustomSize(size);
                  }}
                />
              </HStack>
            </SelectItem>
          ))}
          <SelectItem
            item={{ label: "Create a new size", value: "create-new" }}
            onClick={() => setIsCustom(true)}
          >
            Create a new size
          </SelectItem>
        </SelectContent>
      </SelectRoot>

      {showNameInput && (
        <HStack width="100%">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            size="2xs"
          />
          <Button onClick={handleSaveNamedSize} size="2xs">
            Save
          </Button>
        </HStack>
      )}

      {isCustom && (
        <HStack>
          <SizeInputComponent
            width={width}
            height={height}
            unit={unit}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            onUnitChange={setUnit}
            units={units}
          />
          <Button size="2xs" onClick={handleConfirmCustomSize}>
            Save
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default SizeSelector;
