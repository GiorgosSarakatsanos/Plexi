import React from "react";
import SizeSelector from "../Input/SizeSelector";

interface CanvasDimensionsProps {
  onSizeSelect: (size: string, unit: "mm" | "cm" | "inches" | "pixels") => void;
}

const CanvasDimensions: React.FC<CanvasDimensionsProps> = ({
  onSizeSelect,
}) => {
  const handleSizeSelect = (
    size: string,
    unit: "mm" | "cm" | "inches" | "pixels"
  ) => {
    const sizeParts = size.split("x");

    if (sizeParts.length !== 2) {
      console.error("Invalid size format:", size);
      return;
    }

    let width = Number(sizeParts[0].trim());
    let height = Number(sizeParts[1].trim());

    // Convert the dimensions based on the selected unit
    switch (unit) {
      case "mm":
        width = width * 3.7795;
        height = height * 3.7795;
        break;
      case "cm":
        width = width * 37.795;
        height = height * 37.795;
        break;
      case "inches":
        width = width * 96;
        height = height * 96;
        break;
      case "pixels":
        // No conversion needed for pixels
        break;
      default:
        console.error("Unknown unit:", unit);
        return;
    }

    // Now pass the dimensions as pixels to update the canvas size
    onSizeSelect(`${width}x${height}`, "pixels");
  };

  return (
    <div className="canvas-dimensions">
      <SizeSelector type="imageSize" onSizeSelect={handleSizeSelect} />
    </div>
  );
};

export default CanvasDimensions;
