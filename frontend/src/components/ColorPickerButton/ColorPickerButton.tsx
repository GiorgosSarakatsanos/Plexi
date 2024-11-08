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
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChangeColor(newColor);
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    onOpacityChange(value);
  };

  // Show slider with a delay on hover
  const handleIconMouseEnter = () => {
    const timeout = setTimeout(() => setShowSlider(true), 500); // delay time
    setHoverTimeout(timeout);
  };

  // Clear timeout if hover ends before delay
  const handleIconMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
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
          border="1px transparent"
          borderColor="gray.300"
          boxShadow="inset 0 0 8px 1px rgba(0, 0, 0, 0.15)"
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
          size="2xs"
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
            size="2xs"
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
            onMouseLeave={handleIconMouseLeave}
            onClick={() => setShowSlider(true)} // Open slider on click
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
