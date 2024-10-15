import React, { useState } from "react";
import "../../styles/Button.css";

interface ColorPickerButtonProps {
  onChangeColor: (newColor: string) => void; // Accept onChangeColor as a prop
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  onChangeColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("ffffff"); // Default color (without hashtag)

  // Handle color change from the color picker
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value.replace("#", "").toLowerCase();
    setSelectedColor(newColor); // Update internal state
    onChangeColor(`#${newColor}`); // Notify parent component
  };

  // Handle color change from the text input (hex code)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = e.target.value.toLowerCase(); // Convert input to lowercase
    // Validate the input for valid hex code (excluding the hashtag)
    if (/^[0-9a-f]{0,6}$/i.test(hexValue)) {
      setSelectedColor(hexValue);
    }
  };

  return (
    <div className="color-picker-container">
      {/* The clickable color preview rectangle */}
      <div className="color-preview">
        <label htmlFor="color-input">Pick a color:</label>
        <input
          type="color"
          id="color-input"
          value={`#${selectedColor}`} // Add the hashtag when displaying the color picker
          onChange={handleColorChange}
          className="color-input"
        />
      </div>

      {/* Input field for HEX color */}
      <div className="hex-input-container">
        <label htmlFor="hex-input">HEX code:</label>
        <input
          type="text"
          id="hex-input"
          value={selectedColor}
          onChange={handleInputChange}
          className="hex-input"
          maxLength={6} // Limit to 6 hex characters (no hashtag)
          title="Enter HEX color code"
        />
      </div>
    </div>
  );
};

export default ColorPickerButton;
