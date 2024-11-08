import React from "react";
import { Input, HStack } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "../ui/native-select";

interface SizeInputProps {
  width: string;
  height: string;
  unit: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  units: string[];
  widthRef?: React.RefObject<HTMLInputElement>; // Optional ref for width input
}

const SizeInputComponent: React.FC<SizeInputProps> = ({
  width,
  height,
  unit,
  onWidthChange,
  onHeightChange,
  onUnitChange,
  units,
  widthRef,
}) => {
  return (
    <HStack>
      {/* Width Input */}
      <Input
        ref={widthRef}
        type="text"
        value={width}
        onChange={(e) => onWidthChange(e.target.value)}
        placeholder="Width"
        size="2xs"
      />

      {/* Height Input */}
      <Input
        type="text"
        value={height}
        onChange={(e) => onHeightChange(e.target.value)}
        placeholder="Height"
        size="2xs"
      />

      {/* Unit Select with wider width */}
      <NativeSelectRoot size="xs">
        {" "}
        {/* Adjust width directly here */}
        <NativeSelectField
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
        >
          {units.map((unitOption) => (
            <option key={unitOption} value={unitOption}>
              {unitOption}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </HStack>
  );
};

export default SizeInputComponent;
