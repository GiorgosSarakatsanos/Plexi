import React, { useState } from "react";

interface AreaSizeProps {
  selectedAreaId: string | null; // The ID of the currently selected area
  onResize: (areaId: string, width: number, height: number) => void; // Callback to resize the area
}

const predefinedSizes = [
  { label: "Small (200x200)", width: 200, height: 200 },
  { label: "Medium (400x400)", width: 400, height: 400 },
  { label: "Large (600x600)", width: 600, height: 600 },
  { label: "Wide (800x400)", width: 800, height: 400 },
  { label: "Tall (400x800)", width: 400, height: 800 },
  { label: "Extra Large (1000x1000)", width: 1000, height: 1000 },
  { label: "Banner (1200x300)", width: 1200, height: 300 },
  { label: "Square (500x500)", width: 500, height: 500 },
  { label: "Portrait (300x600)", width: 300, height: 600 },
  { label: "Landscape (600x300)", width: 600, height: 300 },
];

const AreaSize: React.FC<AreaSizeProps> = ({ selectedAreaId, onResize }) => {
  const [customWidth, setCustomWidth] = useState<number>(200);
  const [customHeight, setCustomHeight] = useState<number>(200);

  const handleSizeChange = (width: number, height: number) => {
    if (selectedAreaId) {
      onResize(selectedAreaId, width, height);
    }
  };

  const handleCustomSizeApply = () => {
    if (selectedAreaId) {
      onResize(selectedAreaId, customWidth, customHeight);
    }
  };

  return (
    <div>
      <h3>Resize Area</h3>
      <select
        onChange={(e) => {
          const [width, height] = e.target.value.split("x").map(Number);
          handleSizeChange(width, height);
        }}
        disabled={!selectedAreaId}
        defaultValue=""
      >
        <option value="" disabled>
          Select Size
        </option>
        {predefinedSizes.map((size) => (
          <option key={size.label} value={`${size.width}x${size.height}`}>
            {size.label}
          </option>
        ))}
      </select>
      <div style={{ marginTop: "10px" }}>
        <h4>Custom Size</h4>
        <input
          type="number"
          placeholder="Width"
          value={customWidth}
          onChange={(e) => setCustomWidth(Number(e.target.value))}
          disabled={!selectedAreaId}
        />
        <input
          type="number"
          placeholder="Height"
          value={customHeight}
          onChange={(e) => setCustomHeight(Number(e.target.value))}
          disabled={!selectedAreaId}
        />
        <button onClick={handleCustomSizeApply} disabled={!selectedAreaId}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default AreaSize;
