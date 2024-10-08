// src/components/SizeSelector.tsx
import React, { useState, useEffect, useRef } from "react";
import SizeInputComponent from "../components/SizeInputComponent";
import "../styles/Input.css";

interface SizeSelectorProps {
  type: "paperSize" | "imageSize"; // Can be extended for other types
  predefinedSizes: string[];
  onSizeSelect: (size: string) => void; // Callback to notify parent of selected size
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  type,
  predefinedSizes,
  onSizeSelect,
}) => {
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unit, setUnit] = useState<string>("mm");
  const [name, setName] = useState<string>(""); // Name for custom size
  const [customSizes, setCustomSizes] = useState<string[]>([]); // Named custom sizes
  const [temporarySizes, setTemporarySizes] = useState<string[]>([]); // Temporary unnamed sizes
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

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
    if (!width || !height || !unit) {
      alert("Please enter valid width, height, and unit.");
      return;
    }

    const sizeWithoutName = `${width} x ${height} ${unit}`;
    setSelectedSize(sizeWithoutName);
    onSizeSelect(sizeWithoutName);
    setTemporarySizes([...temporarySizes, sizeWithoutName]); // Add to temporary sizes
    setIsCustom(false);
    setWidth("");
    setHeight("");
    setUnit("mm");
    setIsDropdownOpen(false);
    setShowNameInput(true); // Prompt for optional naming
  };

  // Handle saving a named custom size (move from temporary to named sizes)
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

  // Handle removing a custom size
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

  // Handle canceling the naming of a custom size
  const handleCancelNaming = () => {
    setShowNameInput(false);
    setName("");
  };

  return (
    <div className="size-selector" ref={dropdownRef}>
      <div className="input-row">
        <label>{type === "paperSize" ? "Paper Size" : "Image Size"}: </label>
        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="dropdown-button"
        >
          {selectedSize || "Select Size"} ▼
        </button>

        {/* Inline Name Input */}
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

      {/* Custom Size Input Fields */}
      {isCustom && (
        <div className="input-row">
          <SizeInputComponent
            width={width}
            height={height}
            unit={unit}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            onUnitChange={setUnit}
          />
          <button onClick={handleConfirmCustomSize} className="ok-button">
            OK
          </button>
        </div>
      )}

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="dropdown">
          {/* Predefined Sizes */}
          {predefinedSizes.map((size) => (
            <div className="dropdown-item" key={size}>
              <span onClick={() => handleSelectChange(size)}>{size}</span>
            </div>
          ))}

          {/* Named Custom Sizes */}
          {customSizes.map((size) => (
            <div className="dropdown-item" key={size}>
              <span onClick={() => handleSelectChange(size)}>{size}</span>
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the size selection
                  handleRemoveCustomSize(size);
                }}
              >
                x
              </button>
            </div>
          ))}

          {/* Unnamed Temporary Sizes */}
          {temporarySizes.map((size) => (
            <div className="dropdown-item" key={size}>
              <span onClick={() => handleSelectChange(size)}>{size}</span>
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the size selection
                  handleRemoveCustomSize(size);
                }}
              >
                x
              </button>
            </div>
          ))}

          {/* Option to Add Custom Size */}
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
