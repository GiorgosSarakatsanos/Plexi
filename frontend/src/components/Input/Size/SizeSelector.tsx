import React, { useState, useEffect, useRef } from "react";
import SizeInputComponent from "./SizeInput";
import "../Input.css";
import { sizeMap } from "./SizeMap"; // Import the sizeMap

interface SizeSelectorProps {
  type: "paperSize" | "imageSize"; // Can be extended for other types
  onSizeSelect: (
    width: number,
    height: number,
    unit: "mm" | "cm" | "inches" | "pixels"
  ) => void; // Updated to pass width, height, and unit
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

  useEffect(() => {
    // Set default size from sizeMap only once when the component mounts
    if (!selectedSize) {
      // Only set the size if it hasn't been set yet
      if (type === "imageSize") {
        const defaultImageSize = sizeMap.imageSize.predefined[0]; // e.g., "1800 x 768 pixels"
        const sizeMatch = defaultImageSize.match(/(\d+)\s*x\s*(\d+)/);
        if (sizeMatch) {
          const width = sizeMatch[1]; // Default width
          const height = sizeMatch[2]; // Default height
          const defaultUnit = "pixels"; // Default unit for image size

          setWidth(width);
          setHeight(height);
          setUnit(defaultUnit);
          setSelectedSize(defaultImageSize);

          // Call onSizeSelect with the default size on component mount
          onSizeSelect(parseFloat(width), parseFloat(height), defaultUnit);
        }
      } else if (type === "paperSize") {
        const defaultPaperSize = sizeMap.paperSize.predefined[0]; // e.g., "A4 (210 x 297 mm)"
        const sizeMatch = defaultPaperSize.match(/(\d+)\s*x\s*(\d+)/);
        if (sizeMatch) {
          const width = sizeMatch[1]; // Default width
          const height = sizeMatch[2]; // Default height
          const defaultUnit = "mm"; // Default unit for paper size

          setWidth(width);
          setHeight(height);
          setUnit(defaultUnit);
          setSelectedSize(defaultPaperSize);

          // Call onSizeSelect with the default size on component mount
          onSizeSelect(parseFloat(width), parseFloat(height), defaultUnit);
        }
      }
    }
  }, [type, onSizeSelect, selectedSize]);

  useEffect(() => {
    // Retrieve custom sizes from localStorage when the component mounts
    const savedCustomSizes = localStorage.getItem(`${type}CustomSizes`);
    if (savedCustomSizes) {
      setCustomSizes(JSON.parse(savedCustomSizes)); // Load saved custom sizes
    }
  }, [type]);

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
    // Use regex to match the numeric parts (for width and height)
    const sizeMatch = size.match(/(\d+)\s*x\s*(\d+)/);
    const nameMatch = size.match(/^[^(]+/); // Match everything before the parentheses for name

    if (sizeMatch) {
      const width = sizeMatch[1]; // Extract width
      const height = sizeMatch[2]; // Extract height
      const name = nameMatch ? nameMatch[0].trim() : ""; // Extract name if available

      // Store the full size name with unit internally (for the canvas)
      const fullSizeWithUnit = `${width} x ${height} ${unit}`;
      setSelectedSize(fullSizeWithUnit); // Store the full size internally

      // For display: show name (if available) or dimensions without the unit
      const displayText = name
        ? `${name} (${width} x ${height})`
        : `${width} x ${height}`;
      setSelectedSize(displayText); // Store the display size without unit for the button

      // Pass the width, height, and unit to the canvas
      onSizeSelect(
        parseFloat(width),
        parseFloat(height),
        unit as "mm" | "cm" | "inches" | "pixels"
      );
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

    const sizeWithoutName = `${widthValue} x ${heightValue} ${unit}`; // Include the unit

    // Set the size in the dropdown
    setSelectedSize(sizeWithoutName); // Include unit here

    // Immediately pass the new custom size to update the canvas
    onSizeSelect(
      widthValue,
      heightValue,
      unit as "mm" | "cm" | "inches" | "pixels"
    );

    // Add the new custom size to the temporary list
    setTemporarySizes([...temporarySizes, sizeWithoutName]);

    // Reset the input fields and close the dropdown
    setIsCustom(false);
    setWidth("");
    setHeight("");
    setUnit(units[0]); // Reset unit to the first in the list
    setIsDropdownOpen(false);
    setShowNameInput(true); // Prompt for optional naming
    setShowTooltip(false); // Hide the tooltip when the size is valid
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

    // Update the custom sizes without affecting the canvas size
    setTemporarySizes(updatedTemporarySizes); // Remove from temporary sizes
    const updatedCustomSizes = [...customSizes, newSizeWithName];
    setCustomSizes(updatedCustomSizes); // Add to named sizes

    // Save the custom sizes to localStorage
    localStorage.setItem(
      `${type}CustomSizes`,
      JSON.stringify(updatedCustomSizes)
    ); // Save to localStorage

    // Keep the selected size unchanged, but update its name
    setSelectedSize(newSizeWithName);

    setName("");
    setShowNameInput(false);
  };

  // Handle canceling the naming of a custom size
  const handleCancelNaming = () => {
    setShowNameInput(false);
    setName(""); // Reset name input when canceling
  };

  const handleRemoveCustomSize = (sizeToRemove: string) => {
    // Update the customSizes state by filtering out the size to be removed
    const updatedCustomSizes = customSizes.filter(
      (size) => size !== sizeToRemove
    );
    setCustomSizes(updatedCustomSizes);

    // Update localStorage with the updated customSizes array
    localStorage.setItem(
      `${type}CustomSizes`,
      JSON.stringify(updatedCustomSizes)
    );

    // Remove the size from the temporarySizes array (if applicable)
    const updatedTemporarySizes = temporarySizes.filter(
      (size) => size !== sizeToRemove
    );
    setTemporarySizes(updatedTemporarySizes);

    // If the removed size is currently selected, reset to the default size
    if (selectedSize === sizeToRemove) {
      const defaultSize = predefinedSizes[0] || "";
      setSelectedSize(defaultSize);
      onSizeSelect(
        parseFloat(width),
        parseFloat(height),
        unit as "mm" | "cm" | "inches" | "pixels"
      );
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
              maxLength={20}
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

          <div className="size-dropdown-item" onClick={() => setIsCustom(true)}>
            Custom
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
