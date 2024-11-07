import React, { useState } from "react";
import { Input, Box, HStack, VStack } from "@chakra-ui/react";
import { LuPercent } from "react-icons/lu";
import { Slider } from "../ui/slider"; // Import your custom slider component

interface ColorPickerButtonProps {
  onChangeColor: (newColor: string) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  onChangeColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [opacity, setOpacity] = useState<number>(100);
  const [showSlider, setShowSlider] = useState<boolean>(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChangeColor(newColor);
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
  };

  const opacityHex = Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <VStack align="start">
      <HStack>
        {/* Color preview box */}
        <Box
          bg={`${selectedColor}${opacityHex}`}
          rounded="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            opacity="0"
          />
        </Box>

        {/* Hex Input */}
        <Input
          variant="outline"
          size="xs"
          w={20}
          value={selectedColor.replace("#", "")}
          maxLength={6}
          onChange={(e) => {
            const hexValue = `#${e.target.value}`;
            setSelectedColor(hexValue);
            onChangeColor(hexValue);
          }}
        />

        {/* Opacity input with percentage icon as clickable button */}
        <Box display="flex" alignItems="center">
          <Input
            variant="outline"
            size="xs"
            type="number"
            placeholder="Opacity"
            max={100}
            min={0}
            value={opacity}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
          />
          <Box
            as="button"
            onClick={() => setShowSlider(!showSlider)}
            cursor="pointer"
            m={2}
            p={2}
            border="1px solid transparent"
            _hover={{
              border: "1px solid",
              borderColor: "gray.300", // Adjust color as needed
              borderRadius: "md", // Optional: adds rounded corners
            }}
          >
            <LuPercent />
          </Box>
        </Box>
      </HStack>

      {/* Slider for adjusting opacity */}
      {showSlider && (
        <Box width="100%" mt={2}>
          <Slider
            value={[opacity]}
            onValueChange={(details) => handleOpacityChange(details.value[0])}
            min={0}
            max={100}
          />
        </Box>
      )}
    </VStack>
  );
};

export default ColorPickerButton;
