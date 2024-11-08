import React, { useState, useRef, useEffect } from "react";
import { Input, Box, HStack, VStack } from "@chakra-ui/react";
import { LuPercent } from "react-icons/lu";
import { Slider } from "../ui/slider";

interface ColorPickerButtonProps {
  onChangeColor: (newColor: string) => void;
  onOpacityChange: (opacity: number) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  onChangeColor,
  onOpacityChange,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [opacity, setOpacity] = useState<number>(100);
  const [showSlider, setShowSlider] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null); // Ref for the slider box

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChangeColor(newColor);
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    onOpacityChange(value);
  };

  const handleIconMouseEnter = () => {
    setShowSlider(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sliderRef.current &&
      !sliderRef.current.contains(event.target as Node)
    ) {
      setShowSlider(false);
    }
  };

  useEffect(() => {
    if (showSlider) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSlider]);

  const opacityHex = Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <VStack align="start">
      <HStack>
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
            onMouseEnter={handleIconMouseEnter}
            cursor="pointer"
            m={2}
            p={2}
            border="1px solid transparent"
            _hover={{
              border: "1px solid",
              borderColor: "gray.300",
              borderRadius: "md",
            }}
          >
            <LuPercent />
          </Box>
        </Box>
      </HStack>

      {showSlider && (
        <Box
          width="100%"
          p={2}
          ref={sliderRef} // Attach ref to the slider container
        >
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
