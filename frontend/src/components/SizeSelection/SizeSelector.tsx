import React, { useState, useEffect, useRef } from "react";
import SizeInputComponent from "./SizeInput";
import { sizeMap } from "./SizeMap"; // Import the sizeMap

interface SizeSelectorProps {
  type: "paperSize" | "imageSize"; // Can be extended for other types
  onSizeSelect: (
    width: number,
    height: number,
    unit: "mm" | "cm" | "in" | "px"
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
      if (type === "imageSize") {
        const defaultImageSize = sizeMap.imageSize.predefined[0];
        const sizeMatch = defaultImageSize.match(/(\d+)\s*x\s*(\d+)/);
        if (sizeMatch) {
          const width = sizeMatch[1];
          const height = sizeMatch[2];
          const defaultUnit = "px";

          setWidth(width);
          setHeight(height);
          setUnit(defaultUnit);
          setSelectedSize(defaultImageSize);

          onSizeSelect(parseFloat(width), parseFloat(height), defaultUnit);
        }
      } else if (type === "paperSize") {
        const defaultPaperSize = sizeMap.paperSize.predefined[0];
        const sizeMatch = defaultPaperSize.match(/(\d+)\s*x\s*(\d+)/);
        if (sizeMatch) {
          const width = sizeMatch[1];
          const height = sizeMatch[2];
          const defaultUnit = "mm";

          setWidth(width);
          setHeight(height);
          setUnit(defaultUnit);
          setSelectedSize(defaultPaperSize);

          onSizeSelect(parseFloat(width), parseFloat(height), defaultUnit);
        }
      }
    }
  }, [type, onSizeSelect, selectedSize]);

  useEffect(() => {
    const savedCustomSizes = localStorage.getItem(`${type}CustomSizes`);
    if (savedCustomSizes) {
      setCustomSizes(JSON.parse(savedCustomSizes));
    }
  }, [type]);

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

  const predefinedSizes = sizeMap[type].predefined;
  const units = sizeMap[type].units;

  const handleSelectChange = (size: string) => {
    const sizeMatch = size.match(/(\d+)\s*x\s*(\d+)/);
    const nameMatch = size.match(/^[^(]+/);

    if (sizeMatch) {
      const width = sizeMatch[1];
      const height = sizeMatch[2];
      const name = nameMatch ? nameMatch[0].trim() : "";

      const fullSizeWithUnit = `${width} x ${height} ${unit}`;
      setSelectedSize(fullSizeWithUnit);

      const displayText = name
        ? `${name} (${width} x ${height})`
        : `${width} x ${height}`;
      setSelectedSize(displayText);

      onSizeSelect(
        parseFloat(width),
        parseFloat(height),
        unit as "mm" | "cm" | "in" | "px"
      );
    } else {
      console.error("Invalid size format:", size);
    }

    setIsDropdownOpen(false);
  };

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

    const sizeWithoutName = `${widthValue} x ${heightValue} ${unit}`;

    setSelectedSize(sizeWithoutName);
    onSizeSelect(widthValue, heightValue, unit as "mm" | "cm" | "in" | "px");

    setTemporarySizes([...temporarySizes, sizeWithoutName]);
    setIsCustom(false);
    setWidth("");
    setHeight("");
    setUnit(units[0]);
    setIsDropdownOpen(false);
    setShowTooltip(false);
    setShowNameInput(true);
  };

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

    setTemporarySizes(updatedTemporarySizes);
    const updatedCustomSizes = [...customSizes, newSizeWithName];
    setCustomSizes(updatedCustomSizes);

    localStorage.setItem(
      `${type}CustomSizes`,
      JSON.stringify(updatedCustomSizes)
    );

    setSelectedSize(newSizeWithName);

    setName("");
    setShowNameInput(false);
  };

  const handleCancelNaming = () => {
    setShowNameInput(false);
    setName("");
  };

  const handleRemoveCustomSize = (sizeToRemove: string) => {
    const updatedCustomSizes = customSizes.filter(
      (size) => size !== sizeToRemove
    );
    setCustomSizes(updatedCustomSizes);

    localStorage.setItem(
      `${type}CustomSizes`,
      JSON.stringify(updatedCustomSizes)
    );

    const updatedTemporarySizes = temporarySizes.filter(
      (size) => size !== sizeToRemove
    );
    setTemporarySizes(updatedTemporarySizes);

    if (selectedSize === sizeToRemove) {
      const defaultSize = predefinedSizes[0] || "";
      setSelectedSize(defaultSize);
      if (defaultSize) {
        const sizeMatch = defaultSize.match(/(\d+)\s*x\s*(\d+)/);
        if (sizeMatch) {
          const width = parseFloat(sizeMatch[1]);
          const height = parseFloat(sizeMatch[2]);
          onSizeSelect(width, height, unit as "mm" | "cm" | "in" | "px");
        }
      }
    }
  };

  return (
    <div className="stack-container" ref={dropdownRef}>
      <div>
        {!isCustom && (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="dropdown rectangle extra-extra-large"
          >
            {selectedSize || "Select Size"} ▼
          </button>
        )}
      </div>
      {showNameInput && (
        <div className="stack-container">
          <div>
            <input
              type="text"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="input extra-extra-large"
            />
          </div>
          <div>
            <button
              onClick={handleSaveNamedSize}
              className="button rectangle extra-large"
            >
              Save
            </button>
            <button
              onClick={handleCancelNaming}
              className="button rectangle extra-large"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isCustom && (
        <div className="stack-container">
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
          <button
            onClick={handleConfirmCustomSize}
            className="button rectangle extra-large"
          >
            OK
          </button>
          {showTooltip && <span className="tooltip">{tooltip}</span>}
        </div>
      )}

      {isDropdownOpen && !isCustom && (
        <div className="dropdown-container">
          {predefinedSizes.map((size) => (
            <div className="list-item" key={size}>
              <span
                className="list-item"
                onClick={() => handleSelectChange(size)}
              >
                {size}
              </span>
            </div>
          ))}

          {customSizes.map((size) => (
            <div className="list-item" key={size}>
              <span
                className="list-item"
                onClick={() => handleSelectChange(size)}
              >
                {size}
              </span>
              <button
                className="list-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCustomSize(size);
                }}
              >
                x
              </button>
            </div>
          ))}

          <div className="list-item" onClick={() => setIsCustom(true)}>
            Create a new one
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
