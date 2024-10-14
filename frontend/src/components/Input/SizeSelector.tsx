import React, { useState, useEffect, useRef } from "react";
import SizeInputComponent from "./SizeInput";
import "../../styles/Input.css";
import { sizeMap } from "../../data/SizeMap"; // Import the sizeMap

interface SizeSelectorProps {
  type: "paperSize" | "imageSize"; // Can be extended for other types
  onSizeSelect: (size: string, unit: "mm" | "cm" | "inches" | "pixels") => void; // Updated to pass both size and unit
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ type, onSizeSelect }) => {
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unit, setUnit] = useState<string>("mm");
  const [name, setName] = useState<string>(""); // Name for custom size
  const [customSizes, setCustomSizes] = useState<string[]>([]); // Named custom sizes
  const [temporarySizes, setTemporarySizes] = useState<string[]>([]); // Temporary unnamed sizes
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const [tooltip, setTooltip] = useState<string>(""); // Tooltip message state
  const [showTooltip, setShowTooltip] = useState<boolean>(false); // Show/hide tooltip

  const [showNameInput, setShowNameInput] = useState<boolean>(false); // Controls visibility of name input

  const inputRef = useRef<HTMLInputElement>(null); // Reference for the name input field
  const widthRef = useRef<HTMLInputElement>(null); // Reference for the width input field
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus on the name input when it becomes visible
  useEffect(() => {
    if (showNameInput && inputRef.current) {
      inputRef.current.focus(); // Focus the input when it's shown
    }
  }, [showNameInput]);

  // Focus on the width input when the custom size is selected
  useEffect(() => {
    if (isCustom && widthRef.current) {
      widthRef.current.focus(); // Focus the width input when custom size input is shown
    }
  }, [isCustom]);

  // Load named custom sizes from localStorage on mount
  useEffect(() => {
    const savedSizes = localStorage.getItem(`${type}CustomSizes`);
    if (savedSizes) {
      setCustomSizes(JSON.parse(savedSizes));
    }
  }, [type]);

  // Save named custom sizes to localStorage when they change
  useEffect(() => {
    if (customSizes.length > 0) {
      localStorage.setItem(`${type}CustomSizes`, JSON.stringify(customSizes));
    }
  }, [customSizes, type]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get predefined sizes and allowed units from sizeMap based on type
  const predefinedSizes = sizeMap[type].predefined;
  const units = sizeMap[type].units;

  const handleSelectChange = (size: string) => {
    // Use regex to match only two numeric parts (for width and height) separated by "x"
    const sizeMatch = size.match(/(\d+)\s*x\s*(\d+)/);

    if (sizeMatch) {
      const width = sizeMatch[1]; // First captured number (width)
      const height = sizeMatch[2]; // Second captured number (height)

      const cleanedSize = `${width}x${height}`;
      setIsCustom(false);
      setSelectedSize(cleanedSize);

      // Pass the cleaned size to onSizeSelect
      onSizeSelect(cleanedSize, unit as "mm" | "cm" | "inches" | "pixels");
    } else {
      console.error("Invalid size format:", size);
    }

    setIsDropdownOpen(false);
  };

  // Handle confirming a custom size (unnamed, temporary)
  const handleConfirmCustomSize = () => {
    const widthValue = parseFloat(width);
    const heightValue = parseFloat(height);

    if (isNaN(widthValue) || isNaN(heightValue) || !unit) {
      setTooltip("Please enter valid width, height, and unit.");
      setShowTooltip(true);
      return;
    }

    if (widthValue < 5 || heightValue < 5) {
      setTooltip("Width and height must be at least 5 units.");
      setShowTooltip(true);
      return;
    }

    const sizeWithoutName = `${widthValue}x${heightValue}`; // Ensure proper format
    setSelectedSize(sizeWithoutName);
    onSizeSelect(sizeWithoutName, unit as "mm" | "cm" | "inches" | "pixels"); // Pass both size and unit
    setTemporarySizes([...temporarySizes, sizeWithoutName]); // Add to temporary sizes
    setIsCustom(false);
    setWidth("");
    setHeight("");
    setUnit(units[0]); // Reset unit to the first in the list
    setIsDropdownOpen(false);
    setShowNameInput(true); // Prompt for optional naming
    setShowTooltip(false); // Hide the tooltip when size is valid
  };

  // Handle saving a named custom size
  const handleSaveNamedSize = () => {
    if (!selectedSize) {
      alert("No custom size to name.");
      return;
    }

    if (!name.trim()) {
      alert("Please enter a valid name for the custom size.");
      return;
    }

    const newSizeWithName = `${name.trim()} (${selectedSize})`;
    const updatedTemporarySizes = temporarySizes.filter(
      (size) => size !== selectedSize
    );
    setTemporarySizes(updatedTemporarySizes); // Remove from temporary sizes
    setCustomSizes([...customSizes, newSizeWithName]); // Add to named sizes
    setSelectedSize(newSizeWithName);
    onSizeSelect(newSizeWithName, unit as "mm" | "cm" | "inches" | "pixels"); // Pass both size and unit
    setName("");
    setShowNameInput(false);
  };

  // Handle canceling the naming of a custom size
  const handleCancelNaming = () => {
    setShowNameInput(false);
    setName(""); // Reset name input when canceling
  };

  const handleRemoveCustomSize = (sizeToRemove: string) => {
    const updatedCustomSizes = customSizes.filter(
      (size) => size !== sizeToRemove
    );
    setCustomSizes(updatedCustomSizes);

    const updatedTemporarySizes = temporarySizes.filter(
      (size) => size !== sizeToRemove
    );
    setTemporarySizes(updatedTemporarySizes);

    // If the removed size is currently selected, reset to default
    if (selectedSize === sizeToRemove) {
      const defaultSize = predefinedSizes[0] || "";
      setSelectedSize(defaultSize);
      onSizeSelect(defaultSize, unit as "mm" | "cm" | "inches" | "pixels"); // Pass both size and unit
    }
  };

  return (
    <div className="size-selector" ref={dropdownRef}>
      <div className="input-row">
        {!isCustom && (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="dropdown-button"
          >
            {selectedSize || "Select Size"} ▼
          </button>
        )}

        {showNameInput && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Size Name"
              maxLength={15}
              className="name-input"
            />
            <button onClick={handleSaveNamedSize} className="ok-button">
              Save
            </button>
            <button onClick={handleCancelNaming} className="cancel-button">
              Cancel
            </button>
          </>
        )}
      </div>

      {isCustom && (
        <div className="input-row">
          <SizeInputComponent
            width={width}
            height={height}
            unit={unit}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            onUnitChange={setUnit}
            units={units}
            widthRef={widthRef}
          />
          <button onClick={handleConfirmCustomSize} className="ok-button">
            OK
          </button>
          {showTooltip && <span className="tooltip">{tooltip}</span>}
        </div>
      )}

      {isDropdownOpen && !isCustom && (
        <div className="size-dropdown">
          {predefinedSizes.map((size) => (
            <div className="size-dropdown-item" key={size}>
              <span
                className="dropdown-item-content"
                onClick={() => handleSelectChange(size)}
              >
                {size}
              </span>
            </div>
          ))}

          {customSizes.map((size) => (
            <div className="size-dropdown-item" key={size}>
              <span
                className="size-dropdown-item-content"
                onClick={() => handleSelectChange(size)}
              >
                {size}
              </span>
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCustomSize(size);
                }}
              >
                x
              </button>
            </div>
          ))}

          <div
            className="size-dropdown-item"
            onClick={() => handleSelectChange("custom")}
          >
            Custom
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
