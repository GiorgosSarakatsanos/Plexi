import React, { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  Input,
  Button,
  createListCollection,
} from "@chakra-ui/react";
import { CloseButton } from "../ui/close-button";
import { sizeMap, UnitType } from "./SizeMap";
import { useUnit } from "../../utils/UnitContext";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "../ui/select";
import { NativeSelectRoot, NativeSelectField } from "../ui/native-select";

// Define a type for Size Item with units
interface SizeItem {
  label: string;
  width: number;
  height: number;
  unit: UnitType;
}

interface UnifiedSizeSelectorProps {
  type: "paperSize" | "imageSize";
  onSizeSelect: (width: number, height: number, unit: UnitType) => void;
}

const UnifiedSizeSelector: React.FC<UnifiedSizeSelectorProps> = ({
  type,
  onSizeSelect,
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [name, setName] = useState("");
  const [customSizes, setCustomSizes] = useState<SizeItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<SizeItem | null>(null);

  // Get unit and setUnit from UnitContext
  const { unit, setUnit } = useUnit();

  // Load custom sizes from localStorage on mount
  useEffect(() => {
    const savedCustomSizes = localStorage.getItem(`${type}CustomSizes`);
    if (savedCustomSizes) {
      setCustomSizes(JSON.parse(savedCustomSizes));
    }
  }, [type]);

  // Save custom sizes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`${type}CustomSizes`, JSON.stringify(customSizes));
  }, [customSizes, type]);

  // Predefined sizes with units included
  const predefinedSizes: SizeItem[] = sizeMap[type].predefined.map((size) => ({
    label: size.label,
    width: size.width,
    height: size.height,
    unit: size.unit,
  }));

  const units: UnitType[] = sizeMap[type].units;

  // Initialize default size on load
  useEffect(() => {
    if (!selectedSize && predefinedSizes.length > 0) {
      const defaultSize = predefinedSizes[0];
      setSelectedSize(defaultSize);
      setUnit(defaultSize.unit); // Apply the default unit
      onSizeSelect(defaultSize.width, defaultSize.height, defaultSize.unit);
    }
  }, [selectedSize, predefinedSizes, onSizeSelect, setUnit]);

  // Handle size selection
  const handleSelectChange = (size: SizeItem) => {
    setSelectedSize(size);
    setWidth(size.width.toString());
    setHeight(size.height.toString());
    setUnit(size.unit); // Update the global unit with the selected size’s unit
    onSizeSelect(size.width, size.height, size.unit);
  };

  // Handle unit change for custom sizes
  const handleUnitChange = (newUnit: UnitType) => {
    setUnit(newUnit);
    onSizeSelect(parseFloat(width), parseFloat(height), newUnit);
  };

  // Confirm custom size with unit
  const handleConfirmCustomSize = () => {
    const widthValue = parseFloat(width);
    const heightValue = parseFloat(height);

    if (!widthValue || !heightValue || widthValue < 5 || heightValue < 5) {
      alert("Please enter valid dimensions (at least 5 units).");
      return;
    }

    const tempSize: SizeItem = {
      label: `${widthValue} x ${heightValue} ${unit}`,
      width: widthValue,
      height: heightValue,
      unit: unit,
    };

    const updatedCustomSizes = [...customSizes, tempSize];
    setCustomSizes(updatedCustomSizes);
    setSelectedSize(tempSize);
    onSizeSelect(widthValue, heightValue, unit);

    setIsCustom(false);
    setWidth("");
    setHeight("");
    setShowNameInput(true);
  };

  // Save custom size with a name
  const handleSaveNamedSize = () => {
    if (!name.trim()) {
      alert("Please provide a name for the custom size.");
      return;
    }

    const newSizeWithName = {
      ...selectedSize,
      label: `${name.trim()} (${selectedSize?.label || ""})`,
    } as SizeItem;

    const updatedSizes = customSizes.map((size) =>
      size === selectedSize ? newSizeWithName : size
    );

    setCustomSizes(updatedSizes);
    setSelectedSize(newSizeWithName);

    setName("");
    setShowNameInput(false);
  };

  // New function to close the save prompt without saving
  const handleCancelSaveNamedSize = () => {
    setName(""); // Clear the name input
    setShowNameInput(false); // Hide the save prompt
  };

  const handleRemoveCustomSize = (sizeToRemove: SizeItem) => {
    const updatedSizes = customSizes.filter((size) => size !== sizeToRemove);
    setCustomSizes(updatedSizes);
  };

  const sizeCollection = createListCollection({
    items: [
      ...predefinedSizes.map((size) => ({
        label: size.label,
        value: size,
      })),
      ...customSizes.map((size) => ({
        label: size.label,
        value: size,
      })),
    ],
  });

  return (
    <VStack align="start">
      {/* Size Selection Dropdown */}
      <SelectRoot collection={sizeCollection} size="xs">
        <SelectTrigger>
          <Text>{selectedSize?.label || "Select Size"}</Text>
        </SelectTrigger>
        <SelectContent>
          {predefinedSizes.map((size) => (
            <SelectItem
              key={size.label}
              item={{ label: size.label, value: size }}
              onClick={() => handleSelectChange(size)}
            >
              {size.label}
            </SelectItem>
          ))}
          {customSizes.map((size) => (
            <SelectItem
              key={size.label}
              item={{ label: size.label, value: size }}
              onClick={() => handleSelectChange(size)}
            >
              <HStack>
                <Text>{size.label}</Text>
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

      {/* Custom Size Naming Input */}
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
          <Button size="2xs" onClick={handleCancelSaveNamedSize}>
            Dismiss
          </Button>
        </HStack>
      )}

      {/* Custom Size Input Fields */}
      {isCustom && (
        <HStack>
          <Input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Width"
            size="2xs"
          />

          <Input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Height"
            size="2xs"
          />

          <NativeSelectRoot size="xs">
            <NativeSelectField
              value={unit}
              onChange={(e) => handleUnitChange(e.target.value as UnitType)}
            >
              {units.map((unitOption) => (
                <option key={unitOption} value={unitOption}>
                  {unitOption}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>

          <Button size="2xs" onClick={handleConfirmCustomSize}>
            Save
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default UnifiedSizeSelector;
