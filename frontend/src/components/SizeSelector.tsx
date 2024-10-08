import React, { useState, useEffect, useRef } from "react";
import SizeInputComponent from "./SizeInput";
import "../styles/Input.css";
import { sizeMap } from "../data/SizeMap"; // Import the sizeMap

interface SizeSelectorProps {
  type: "paperSize" | "imageSize"; // Can be extended for other types
  onSizeSelect: (size: string) => void; // Callback to notify parent of selected size
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

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle size selection (predefined, named, or custom)
  const handleSelectChange = (size: string) => {
    if (size === "custom") {
      setIsCustom(true);
      setSelectedSize("");
    } else {
      setIsCustom(false);
      setSelectedSize(size);
      onSizeSelect(size);
    }
    setIsDropdownOpen(false);
  };

  // Handle confirming a custom size (unnamed, temporary)
  const handleConfirmCustomSize = () => {
    const widthValue = parseFloat(width);
    const heightValue = parseFloat(height);

    if (!widthValue || !heightValue || !unit) {
      setTooltip("Please enter valid width, height, and unit.");
      setShowTooltip(true);
      return;
    }

    if (widthValue < 5 || heightValue < 5) {
      setTooltip("Width and height must be at least 5 units.");
      setShowTooltip(true);
      return;
    }

    const sizeWithoutName = `${widthValue} x ${heightValue} ${unit}`;
    setSelectedSize(sizeWithoutName);
    onSizeSelect(sizeWithoutName);
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
    onSizeSelect(newSizeWithName);
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
      onSizeSelect(defaultSize);
    }
  };

  return (
    <div className="size-selector" ref={dropdownRef}>
      <div className="input-row">
        {!isCustom && ( // Only show the dropdown when custom size is not selected
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

      {isCustom && ( // Show the custom size input when isCustom is true
        <div className="input-row">
          <SizeInputComponent
            width={width}
            height={height}
            unit={unit}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            onUnitChange={setUnit}
            units={units} // Pass the available units to SizeInputComponent
          />
          <button onClick={handleConfirmCustomSize} className="ok-button">
            OK
          </button>
          {/* Tooltip for invalid size */}
          {showTooltip && <span className="tooltip">{tooltip}</span>}
        </div>
      )}

      {isDropdownOpen &&
        !isCustom && ( // Show the dropdown only when it's open and not custom
          <div className="dropdown">
            {predefinedSizes.map((size) => (
              <div className="dropdown-item" key={size}>
                <span
                  className="dropdown-item-content"
                  onClick={() => handleSelectChange(size)}
                >
                  {size}
                </span>
              </div>
            ))}

            {customSizes.map((size) => (
              <div className="dropdown-item" key={size}>
                <span
                  className="dropdown-item-content"
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
              className="dropdown-item"
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
