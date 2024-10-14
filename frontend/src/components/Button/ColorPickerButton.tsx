import React, { useState, useRef } from "react";
import "../../styles/Button.css";

interface ColorPickerButtonProps {
  onChangeColor: (newColor: string) => void; // Accept onChangeColor as a prop
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  onChangeColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("ffffff"); // Default color (without hashtag)
  const [showTooltip, setShowTooltip] = useState<boolean>(false); // Tooltip visibility state
  const tooltipRef = useRef<HTMLDivElement | null>(null); // Reference to the tooltip element

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

  // Handle text selection when input is focused
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select(); // Select the entire text when the input is focused
  };

  // Handle text pasted into the input
  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent the default paste behavior
    const pastedText = e.clipboardData.getData("Text"); // Get the pasted text
    // Remove unwanted characters (hashtags, spaces, and limit to valid hex characters)
    const sanitizedText = pastedText.replace(/[^0-9a-f]/gi, "").toLowerCase();
    setSelectedColor(sanitizedText.slice(0, 6)); // Limit to 6 characters
  };

  // Handle key events for copy (Ctrl + C) and paste (Ctrl + V)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
      showCopyTooltip(); // Show tooltip when Ctrl + C is pressed
    }
  };

  // Show the "HEX copied!" tooltip and hide it after a short delay
  const showCopyTooltip = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000); // Hide after 2 seconds
  };

  return (
    <div className="color-picker-container" style={{ position: "relative" }}>
      {/* The clickable color preview rectangle */}
      <div
        className="color-preview"
        style={{ backgroundColor: `#${selectedColor}` }}
      >
        <input
          type="color"
          value={`#${selectedColor}`} // Add the hashtag when displaying the color picker
          onChange={handleColorChange}
          className="color-input"
        />
      </div>

      {/* Input field for HEX color */}
      <div className="hex-input-container">
        <input
          type="text"
          value={selectedColor}
          onChange={handleInputChange}
          onFocus={handleInputFocus} // Select the text when the input is focused
          onPaste={handleInputPaste} // Handle pasted content
          onKeyDown={handleKeyDown} // Detect key presses for copy/paste
          className="hex-input"
          maxLength={6} // Limit to 6 hex characters (no hashtag)
        />
      </div>

      {/* Tooltip for "HEX copied!" */}
      {showTooltip && (
        <div className="tooltip" ref={tooltipRef}>
          HEX copied!
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;
