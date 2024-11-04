import React from "react";

interface SizeInputProps {
  width: string;
  height: string;
  unit: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  units: string[];
  widthRef?: React.RefObject<HTMLInputElement>; // Optional ref for width input
}

const SizeInputComponent: React.FC<SizeInputProps> = ({
  width,
  height,
  unit,
  onWidthChange,
  onHeightChange,
  onUnitChange,
  units,
  widthRef,
}) => {
  const evaluateExpression = (expression: string): string => {
    try {
      const result = new Function("return " + expression)();
      if (isNaN(result)) throw new Error("Invalid expression");
      return result.toString();
    } catch (error) {
      console.error("Invalid expression:", error);
      return expression;
    }
  };

  return (
    <div className="inline-container">
      <input
        ref={widthRef}
        type="text"
        value={width}
        onChange={(e) => onWidthChange(e.target.value)}
        onBlur={() => onWidthChange(evaluateExpression(width))}
        placeholder="Width"
        className="input extra-large"
      />
      <input
        type="text"
        value={height}
        onChange={(e) => onHeightChange(e.target.value)}
        onBlur={() => onHeightChange(evaluateExpression(height))}
        placeholder="Height"
        className="input extra-large"
      />

      {/* Add a title attribute for accessibility */}
      <select
        title="Select unit" // Provide an accessible name for the select element
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="dropdown large"
      >
        {units.map((unitOption: string) => (
          <option key={unitOption} value={unitOption}>
            {unitOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeInputComponent;
