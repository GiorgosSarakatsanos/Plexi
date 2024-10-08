// src/components/SizeInputComponent.tsx
import React from "react";

interface SizeInputProps {
  width: string;
  height: string;
  unit: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onUnitChange: (value: string) => void;
}

const SizeInputComponent: React.FC<SizeInputProps> = ({
  width,
  height,
  unit,
  onWidthChange,
  onHeightChange,
  onUnitChange,
}) => {
  return (
    <div className="input-row">
      <input
        type="number"
        value={width}
        onChange={(e) => onWidthChange(e.target.value)}
        placeholder="Width"
        className="size-input"
        min="0"
      />
      <span className="separator">x</span>
      <input
        type="number"
        value={height}
        onChange={(e) => onHeightChange(e.target.value)}
        placeholder="Height"
        className="size-input"
        min="0"
      />
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="unit-dropdown"
      >
        <option value="mm">mm</option>
        <option value="cm">cm</option>
        <option value="m">m</option>
        <option value="inches">inches</option>
        <option value="px">pixels</option>
      </select>
    </div>
  );
};

export default SizeInputComponent;
