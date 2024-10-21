import React, { useState } from "react";
import "../Button/Button.css";
import "../ColorPickerButton/ColorPickerButton.css";

interface ColorPickerButtonProps {
  onChangeColor: (newColor: string) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  onChangeColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor); // Update state with selected color
    onChangeColor(newColor); // Pass the color to parent
  };

  return (
    <div className="color-picker-container">
      {/* Color preview box */}
      <div
        className="color-preview"
        style={{ backgroundColor: selectedColor }} // Set background color
      >
        <input
          type="color"
          value={selectedColor} // Sync with state
          onChange={handleColorChange}
        />
      </div>

      {/* HEX input field */}
      <div className="hex-input-container">
        <input
          type="text"
          value={selectedColor.replace("#", "")} // Remove hashtag
          maxLength={6}
          onChange={(e) => {
            const hexValue = `#${e.target.value}`;
            setSelectedColor(hexValue);
            onChangeColor(hexValue);
          }}
        />
      </div>
    </div>
  );
};

export default ColorPickerButton;
