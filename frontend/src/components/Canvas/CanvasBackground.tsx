import React from "react";
import ColorPickerButton from "../Button/ColorPickerButton";

interface CanvasBackgroundProps {
  onChangeColor: (color: string) => void; // Ensure this prop is defined
}

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  onChangeColor,
}) => {
  return (
    <div className="canvas-background">
      <ColorPickerButton onChangeColor={onChangeColor} />
    </div>
  );
};

export default CanvasBackground;
