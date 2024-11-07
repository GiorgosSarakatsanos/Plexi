import React, { useState } from "react";
import "../Button/ButtonStyle.css";
import { Input, Box, HStack } from "@chakra-ui/react";

import { InputGroup } from "../ui/input-group";
import { LuPercent } from "react-icons/lu";

interface ColorPickerButtonProps {
  onChangeColor: (newColor: string) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  onChangeColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [opacity, setOpacity] = useState<number>(100); // State for opacity (0-100)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChangeColor(newColor);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = Math.min(Math.max(Number(e.target.value), 0), 100);
    setOpacity(newOpacity);
  };

  return (
    <HStack>
      <Box>
        {/* Color preview box */}
        <Box
          boxSize="40px"
          bg={`${selectedColor}${Math.round((opacity / 100) * 255)
            .toString(16)
            .padStart(2, "0")}`}
          rounded="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <Input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            boxSize="100%"
            opacity="0"
          />
        </Box>
      </Box>

      <Box>
        <Input
          variant="outline"
          size="xs"
          value={selectedColor.replace("#", "")}
          maxLength={6}
          onChange={(e) => {
            const hexValue = `#${e.target.value}`;
            setSelectedColor(hexValue);
            onChangeColor(hexValue);
          }}
        />
      </Box>

      {/* Opacity input with percent symbol */}
      <Box>
        <InputGroup endElement={<LuPercent />}>
          <Input
            variant="outline"
            size="xs"
            type="number"
            placeholder="Opacity"
            max={100}
            min={0}
            value={opacity}
            onChange={handleOpacityChange}
          />
        </InputGroup>
      </Box>
    </HStack>
  );
};

export default ColorPickerButton;
