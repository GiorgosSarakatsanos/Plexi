import React, { useState } from "react";

interface AreaSizeProps {
  onSizeChange: (width: number, height: number, unit: string) => void; // Callback for size change
}

const AreaSize: React.FC<AreaSizeProps> = ({ onSizeChange }) => {
  const [unit, setUnit] = useState("px");
  const [selectedSize, setSelectedSize] = useState("");

  // Predefined sizes with width, height, and description
  const sizes = [
    { id: "web", label: "Web (1920x1080)", width: 1920, height: 1080 },
    { id: "page-a4", label: "A4 (210x297 mm)", width: 210, height: 297 },
    { id: "page-letter", label: "Letter (8.5x11 in)", width: 8.5, height: 11 },
    {
      id: "business-card",
      label: "Business Card (85x55 mm)",
      width: 85,
      height: 55,
    },
    { id: "brochure", label: "Brochure (297x420 mm)", width: 297, height: 420 },
    { id: "banner", label: "Banner (1600x400 px)", width: 1600, height: 400 },
    {
      id: "square-small",
      label: "Square (300x300 px)",
      width: 300,
      height: 300,
    },
    {
      id: "poster-a1",
      label: "Poster A1 (594x841 mm)",
      width: 594,
      height: 841,
    },
    {
      id: "poster-a2",
      label: "Poster A2 (420x594 mm)",
      width: 420,
      height: 594,
    },
    {
      id: "poster-a3",
      label: "Poster A3 (297x420 mm)",
      width: 297,
      height: 420,
    },
    {
      id: "social-post",
      label: "Social Post (1080x1080 px)",
      width: 1080,
      height: 1080,
    },
    { id: "flyer", label: "Flyer (148x210 mm)", width: 148, height: 210 },
    {
      id: "tablet-screen",
      label: "Tablet Screen (1024x768 px)",
      width: 1024,
      height: 768,
    },
    {
      id: "mobile-screen",
      label: "Mobile Screen (375x667 px)",
      width: 375,
      height: 667,
    },
    {
      id: "web-banner",
      label: "Web Banner (728x90 px)",
      width: 728,
      height: 90,
    },
    {
      id: "square-large",
      label: "Square Large (800x800 px)",
      width: 800,
      height: 800,
    },
    {
      id: "presentation-slide",
      label: "Presentation Slide (1920x1080 px)",
      width: 1920,
      height: 1080,
    },
    {
      id: "wide-banner",
      label: "Wide Banner (2560x400 px)",
      width: 2560,
      height: 400,
    },
    {
      id: "book-cover",
      label: "Book Cover (174x248 mm)",
      width: 174,
      height: 248,
    },
    { id: "photo-5x7", label: "Photo (5x7 in)", width: 5, height: 7 },
  ];

  const handleSizeSelect = (sizeId: string) => {
    const selected = sizes.find((size) => size.id === sizeId);
    if (selected) {
      setSelectedSize(sizeId);
      onSizeChange(selected.width, selected.height, unit);
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value);

    // Adjust sizes when the unit changes
    const selected = sizes.find((size) => size.id === selectedSize);
    if (selected) {
      let width = selected.width;
      let height = selected.height;

      if (e.target.value === "mm") {
        width *= 0.264583; // px to mm conversion
        height *= 0.264583;
      } else if (e.target.value === "m") {
        width *= 0.000264583; // px to meters conversion
        height *= 0.000264583;
      } else if (e.target.value === "in") {
        width *= 0.0104167; // px to inches conversion
        height *= 0.0104167;
      } else {
        // Default back to px
        width = selected.width;
        height = selected.height;
      }

      onSizeChange(width, height, e.target.value);
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid lightgray",
        borderRadius: "5px",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="unit-selector" style={{ marginRight: "5px" }}>
          Unit:
        </label>
        <select
          id="unit-selector"
          value={unit}
          onChange={handleUnitChange}
          style={{ padding: "5px", borderRadius: "3px" }}
        >
          <option value="px">Pixels (px)</option>
          <option value="mm">Millimeters (mm)</option>
          <option value="m">Meters (m)</option>
          <option value="in">Inches (in)</option>
        </select>
      </div>
      <div>
        <label htmlFor="size-selector" style={{ marginRight: "5px" }}>
          Size:
        </label>
        <select
          id="size-selector"
          value={selectedSize}
          onChange={(e) => handleSizeSelect(e.target.value)}
          style={{ padding: "5px", borderRadius: "3px", width: "100%" }}
        >
          <option value="">Select a size</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AreaSize;
