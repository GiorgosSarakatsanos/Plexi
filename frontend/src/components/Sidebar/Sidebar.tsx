import React from "react";
import { VStack, Separator } from "@chakra-ui/react";
import { LuImage, LuLayout, LuPalette } from "react-icons/lu";
import SizeSelector from "../SizeSelection/SizeSelector";
import ColorPickerButton from "../ColorPickerButton/ColorPickerButton";
import CollapsibleSection from "./CollapsibleSection"; // Import the new component

interface SidebarProps {
  onSizeSelect: (
    width: number,
    height: number,
    unit: "mm" | "cm" | "in" | "px"
  ) => void;
  handleColorChange: (color: string) => void;
  handleOpacityChange: (opacity: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSizeSelect,
  handleColorChange,
  handleOpacityChange,
}) => {
  return (
    <VStack align="stretch" height="100%" gap={2} pr={2} pl={2}>
      <Separator />
      <CollapsibleSection icon={<LuImage />} title="Size" defaultOpen>
        <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
      </CollapsibleSection>
      <Separator />
      <CollapsibleSection icon={<LuPalette />} title="Color">
        <ColorPickerButton
          onChangeColor={handleColorChange}
          onOpacityChange={handleOpacityChange}
        />
      </CollapsibleSection>
      <Separator />
      <CollapsibleSection icon={<LuLayout />} title="Grid">
        <ColorPickerButton
          onChangeColor={handleColorChange}
          onOpacityChange={handleOpacityChange}
        />
      </CollapsibleSection>
      <Separator />
    </VStack>
  );
};

export default Sidebar;
